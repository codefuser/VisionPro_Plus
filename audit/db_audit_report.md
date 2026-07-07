# Database Schema Audit Report

## 1. Discovery and Overview
Three SQLite databases were inspected:
1. `data/english_bible.db` (5 MB)
2. `data/tamil_bible.db` (17 MB)
3. `data/tamilsongs.sqlite` (37 MB)

---

## 2. English & Tamil Bible (`english_bible.db`, `tamil_bible.db`)

Both Bible databases share an identical structure.

### Schema Structure
* **Table**: `bible`
* **Row Count**: 31,102 rows each

**Columns:**
* `Book` (int)
* `Chapter` (int)
* `Versecount` (int)
* `verse` (varchar(528))

### Audit Findings
* **Primary Keys**: **Missing.** There is no unique identifier column (e.g., `id`), though `Book`, `Chapter`, and `Versecount` act as a composite key conceptually.
* **Searchable Fields**: `verse`
* **Existing Indexes**: **None.** There are zero indexes on this table.

---

## 3. Tamil Songs (`tamilsongs.sqlite`)

This database contains song lyrics along with metadata (artists, albums, genres).

### Schema Structure
**1. `songs`** (16,075 rows)
* `id` (INTEGER PRIMARY KEY)
* `title` (TEXT)
* `content` (TEXT) - *The lyrics/body of the song*
* `youtube` (TEXT)
* `artist` (TEXT)
* `album` (TEXT)
* `genre` (TEXT)
* `scale` (TEXT)
* `beat` (TEXT)
* `tempo` (TEXT)
* `chords` (TEXT)
* `karoke` (TEXT)

**2. `albums`** (91 rows)
* `id` (INTEGER PRIMARY KEY)
* `title` (TEXT)
* `eng_title` (TEXT)

**3. `artists`** (100 rows)
* `id` (INTEGER PRIMARY KEY)
* `title` (TEXT)
* `eng_title` (TEXT)
* `details` (TEXT)

**4. `genres`** (39 rows)
* `id` (INTEGER PRIMARY KEY)
* `title` (TEXT)
* `eng_title` (TEXT)

**5. `art_alb_map`** (104 rows)
* `alb_id` (No type defined)
* `art_id` (No type defined)

### Table Relationships
* The `art_alb_map` table serves as a **many-to-many junction table** linking `albums` and `artists`.
* **Denormalization Issue**: The `songs` table stores `artist`, `album`, and `genre` as `TEXT` rather than Foreign Keys linking back to the `artists`, `albums`, and `genres` tables. This means metadata in the `songs` table is decoupled from the actual entity tables.

### Audit Findings
* **Primary Keys**: Explicitly defined on `songs`, `albums`, `artists`, and `genres`. `art_alb_map` lacks a primary key.
* **Searchable Fields**: `title`, `content` (in `songs`). `title`, `eng_title` (in metadata tables).
* **Existing Indexes**: **None.** No indexes exist outside of the auto-generated indexes for `PRIMARY KEY`.

---

## 4. Missing Indexes

For optimal query performance, the following standard B-Tree indexes are severely missing:

**Bible Databases:**
* Index on `(Book, Chapter, Versecount)` for fast exact-verse lookups.
* Index on `(Book, Chapter)` for loading full chapters quickly.

**Songs Database:**
* Index on `songs(artist)`, `songs(album)`, and `songs(genre)` if filtering by these text columns.
* Indexes on `art_alb_map(alb_id)` and `art_alb_map(art_id)` for the mapping table.

---

## 5. Search Optimization & FTS5 Strategy

The current setup relies entirely on `LIKE '%keyword%'` queries, which will force a full table scan across 31,000+ bible verses and 16,000+ song lyrics.

### Recommended FTS5 Implementation

**Bible FTS5:**
Create a virtual table that indexes the verses but retains reference to the location:
```sql
CREATE VIRTUAL TABLE bible_fts USING fts5(
    verse,
    Book UNINDEXED,
    Chapter UNINDEXED,
    Versecount UNINDEXED,
    tokenize='unicode61'
);
```

**Songs FTS5:**
Create a virtual table for rapid title and lyrics search:
```sql
CREATE VIRTUAL TABLE songs_fts USING fts5(
    title,
    content,
    song_id UNINDEXED, -- References songs(id)
    tokenize='unicode61'
);
```
*Note: We use `unicode61` tokenizer to properly handle non-ASCII Tamil characters.*

---

## 6. Tamil + Tanglish Search Strategy

Searching across Tamil content poses a unique challenge: Users will likely search in native Tamil script (e.g., "அன்பு") or Tanglish / Romanized Tamil (e.g., "Anbu").

### Strategy Recommendations

1. **Pre-computed Tanglish Columns (Recommended):**
   * Introduce a new column `tanglish_content` and `tanglish_title` in your databases (or directly into the FTS5 virtual tables).
   * Run a one-time background script (using a library like `indic-transliteration` or `Azhagi`) to transliterate all Tamil script in the databases into Tanglish.
   * When a user searches, detect the script (English alphabet vs Tamil alphabet). If English, query against the `tanglish_*` fields. If Tamil, query the native fields.

2. **Custom SQLite Tokenizer (Advanced):**
   * Write a custom tokenizer extension for SQLite (often written in C/Rust/Go) that intercepts search queries and normalizes/transliterates Tamil characters on-the-fly to a phonetic baseline.
   * *Pros*: Doesn't bloat the database size.
   * *Cons*: Difficult to deploy and maintain, especially in serverless or browser environments.

3. **Application-Level Query Expansion:**
   * If a user types "Anbu", the backend application transliterates this search term into possible Tamil variants (e.g., "அன்பு", "அண்பு") before executing the SQL query.
   * *SQL Example:* `MATCH 'verse: "அன்பு" OR verse: "அண்பு"'`

**Conclusion**: The **Pre-computed Tanglish Columns** paired with an **FTS5 Virtual Table** is the most robust, performant, and easiest-to-maintain solution for Tamil/Tanglish search support.
