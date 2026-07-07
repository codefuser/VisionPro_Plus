# VisionPro Technical Implementation Specification

This document details the exact file, database, API, and architectural changes required to execute the offline database strategy and search engine implementation.

## 1. Exact File-by-File Implementation Plan

### Dependencies
* **Install**: `better-sqlite3`, `@types/better-sqlite3` (for SQLite access), and optionally an indic-transliteration library for the Tanglish migration script.

### Files to Delete
* `src/assets/bible/en.bible.json.asset.json`
* `src/assets/bible/ta.bible.json.asset.json`
* `src/assets/songs/tamilsongs.json.asset.json`

### Files to Create
* `src/db/sqlite.ts` -> Initializes singleton `better-sqlite3` connections to all three databases with optimized PRAGMAs.
* `src/db/migrations.ts` -> DDL script to create B-Tree indexes, FTS5 virtual tables, and populate them from existing tables.
* `src/db/tanglish-mapper.ts` -> One-off utility script to transliterate existing Tamil titles into the new `tanglish_title` column and update the FTS5 table.
* `src/server/bible.ts` -> TanStack Server Functions (`createServerFn`) to query the Bible database.
* `src/server/songs.ts` -> TanStack Server Functions (`createServerFn`) to query the Songs database.
* `src/lib/search/bible-parser.ts` -> Regex logic and Book Alias Mappings.
* `src/lib/search/bible-parser.test.ts` -> Unit tests verifying parser constraints.

### Files to Modify
* `src/lib/bible/loader.ts` -> Remove cloud fetch/cache logic; bridge to `src/server/bible.ts`.
* `src/lib/songs/loader.ts` -> Remove cloud fetch/cache logic; bridge to `src/server/songs.ts`.
* `src/features/songs/SongsSearch.tsx` (and related search UI components) -> Implement `useQuery` with `useDebounce` to trigger Server Functions instead of filtering local array state.

---

## 2. Database Migration & Indexing Strategy

We will retain the existing `songs` schema but append a new column and apply robust indexing.

### `english_bible.db` & `tamil_bible.db`
1. **B-Tree Indexes**:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_bible_book_chapter ON bible(Book, Chapter);
   CREATE INDEX IF NOT EXISTS idx_bible_book_chapter_verse ON bible(Book, Chapter, Versecount);
   ```

### `tamilsongs.sqlite`
1. **Schema Modifications**:
   ```sql
   ALTER TABLE songs ADD COLUMN tanglish_title TEXT;
   ```
2. **B-Tree Indexes**:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist);
   CREATE INDEX IF NOT EXISTS idx_songs_album ON songs(album);
   CREATE INDEX IF NOT EXISTS idx_songs_genre ON songs(genre);
   ```

---

## 3. FTS5 Implementation Plan

FTS5 virtual tables will act as dedicated search indexes decoupled from primary read tables, leveraging the `unicode61` tokenizer to process non-ASCII (Tamil) text correctly.

### Bible FTS5 Tables (In both English & Tamil DBs)
```sql
CREATE VIRTUAL TABLE IF NOT EXISTS bible_fts USING fts5(
    verse,
    Book UNINDEXED,
    Chapter UNINDEXED,
    Versecount UNINDEXED,
    tokenize='unicode61'
);

-- Populate
INSERT INTO bible_fts(rowid, verse, Book, Chapter, Versecount) 
SELECT rowid, verse, Book, Chapter, Versecount FROM bible;
```

### Songs FTS5 Table
```sql
CREATE VIRTUAL TABLE IF NOT EXISTS songs_fts USING fts5(
    title,
    content,
    tanglish_title,
    song_id UNINDEXED,
    tokenize='unicode61'
);

-- Populate
INSERT INTO songs_fts(rowid, title, content, tanglish_title, song_id) 
SELECT id, title, content, tanglish_title, id FROM songs;
```

---

## 4. Tanglish Search Implementation Plan

1. **Pre-population (Build/Migration Step)**: 
   * The `src/db/tanglish-mapper.ts` script will query all songs. If `title` contains Tamil characters, it will generate a romanized representation (e.g., `அன்பு` -> `anbu`) and save it to the `tanglish_title` column.
   * `songs_fts` will index this column.
2. **Search Flow**:
   * If a user types "yeshuve" (English characters), the query will target `songs_fts MATCH 'tanglish_title:yeshuve* OR title:yeshuve*'`.
   * If a user types "இயேசுவே" (Tamil characters), the query targets `songs_fts MATCH 'title:இயேசுவே* OR content:இயேசுவே*'`.

---

## 5. Bible Alias Mapping & Reference Parser

To support multiple languages and abbreviations, `src/lib/search/bible-parser.ts` will drive the Bible search UI.

**Book Alias Map Dictionary**:
```typescript
const BOOK_ALIASES: Record<string, number> = {
  // English
  "gen": 1, "genesis": 1,
  "psa": 19, "psalm": 19, "psalms": 19,
  // Tamil / Tanglish
  "sang": 19, "sangeetham": 19,
  "சங்கீதம்": 19,
  "aathi": 1, "ஆதியாகமம்": 1
  // ... exhaustive mapping of 66 books ...
};
```

**Regex Parser Rule**:
* `^([A-Za-z\u0B80-\u0BFF\s]+)\s*(\d+)(?::(\d+))?$`
* **Capture Group 1**: Book string -> Sanitized, Lowercased -> Looked up in `BOOK_ALIASES`.
* **Capture Group 2**: Chapter `(int)`.
* **Capture Group 3**: Verse `(int)` (Optional).

*Execution*: If parsed successfully, the client immediately invokes the server function for an exact match `SELECT * FROM bible WHERE Book=? AND Chapter=?`. If it doesn't parse into a reference, it falls back to a global FTS5 keyword search across verses.

---

## 6. Instant Suggestion Plan

1. **Client Trigger**: The search input triggers `setSearchTerm(value)`.
2. **Debounce**: A 150ms debounce (`useDebounce`) pauses network calls until typing slows down.
3. **Execution**: The `useQuery` hook fires the server function `searchSongsFn({ query })`.
4. **Server SQL Logic**: 
   ```sql
   SELECT song_id, title FROM songs_fts WHERE songs_fts MATCH ? LIMIT 10;
   ```
5. **Payload**: The backend returns a lightweight JSON array `[{ id: 1, title: '...' }]` to rapidly populate the dropdown.

---

## 7. Server Function Architecture

The architecture relies on `@tanstack/react-start`'s unified server functions.

1. **Connection Pooling**: `src/db/sqlite.ts` exports shared `better-sqlite3` database connections.
   ```typescript
   export const getSongsDb = () => new Database('data/tamilsongs.sqlite', { readonly: false });
   ```
2. **`createServerFn` Wrapping**:
   ```typescript
   import { createServerFn } from '@tanstack/react-start';
   
   export const searchSongsFn = createServerFn({ method: 'GET' })
     .validator((d: { query: string }) => d)
     .handler(async ({ data }) => {
        // execute FTS5 query using getSongsDb()
        return results;
     });
   ```
3. **Client Consumption**: Client components import `searchSongsFn` directly as the `queryFn` inside a TanStack `useQuery`.

---

## 8. Testing Strategy

1. **Unit Tests (Parser)**:
   * Write Vitest specs verifying `Sang 23:1`, `Psalm 23`, `Psa 23`, `சங்கீதம் 23` strictly resolve to `{ book: 19, chapter: 23, verse: 1 | undefined }`.
   * Assert invalid formats gracefully fallback to keyword search mode.
2. **Integration Tests (SQLite)**:
   * Execute server functions against a mocked/cloned SQLite dataset to confirm response times `< 100ms`.
   * Verify FTS5 yields case-insensitive and transliteration-tolerant matches.
