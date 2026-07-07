# Implementation Plan - Search System Redesign

We will redesign the Tamil/Tanglish song search and the Bible book/reference search to support highly imperfect, misspelled, and sound-alike query variations.

## User Review Required

> [!IMPORTANT]
> - **Database Migration**: We will alter the `songs` schema to add four columns (`lyrics`, `normalized_lyrics`, `tanglish_lyrics`, `normalized_tanglish_lyrics`) and rebuild the FTS5 virtual table. This migration will run automatically when starting the server or via the migration script, processing all 16,075 songs.
> - **7-Layer Search Engine**: In-memory scoring will be applied to the top 120 candidate songs retrieved by FTS5, ensuring sub-5ms retrieval times while delivering perfect ranking accuracy.

## Proposed Changes

### Database Layer

#### [MODIFY] [tanglish-mapper.ts](file:///d:/My_Projects/VisionPro/src/db/tanglish-mapper.ts)
- Add columns to `songs` table:
  - `lyrics` (clean original text with normalized line endings)
  - `normalized_lyrics` (Tamil text lowercased, stripped of punctuation, and whitespace collapsed)
  - `tanglish_lyrics` (raw transliterated phonetics)
  - `normalized_tanglish_lyrics` (transliterated text with vowel collapsing, consonant sound-alike mapping, and final vowel/suffix stripping)
- Populate all columns for all 16,075 songs.
- Recreate `songs_fts` virtual table using FTS5 to index all title and lyrics fields.

---

### Songs Search Layer

#### [MODIFY] [songs.ts](file:///d:/My_Projects/VisionPro/src/server/songs.ts)
- Implement `normalizeToken(token)` and `normalizeText(text)` using aggressive phonetic mappings:
  - Vowel mapping (`ea` -> `e`, `ee` -> `i`, `oo` -> `u`, `uu` -> `u`, `aa` -> `a`, `ae` -> `e`, `ai` -> `e`, `ay` -> `e`, `ey` -> `e`).
  - Consonant mapping (`sh` -> `s`, `zh` -> `l`, `lh` -> `l`, `ph` -> `p`, `kh` -> `k`, `gh` -> `k`, `th` -> `t`, `h` -> `k`, `d` -> `t`, `b` -> `p`, `g` -> `k`, `j` -> `s`, `w` -> `v`).
  - Collapse duplicate letters (`([a-z])\1+` -> `$1`).
  - Strip final vowels/suffixes (`[aeiou]+$`) for words of length > 2.
  - Map specific key religious words (`yesu` variants, `karthar` variants, `nala` variants) to unique singular roots.
- Rewrite `performSongSearch(query)` to execute:
  - **Layer 1**: Exact Tamil Title/Lyrics Match (if query contains Tamil script).
  - **Layer 2**: Exact/Substring Tanglish Match on raw transliterated columns.
  - **Layer 3**: Normalized Tanglish Match on `normalized_tanglish_lyrics` using FTS5 `OR` queries.
  - **Layer 4**: Fuzzy Match (Levenshtein distance) on single search tokens.
  - **Layer 5**: Trigram Similarity Match between query and title/lyrics.
  - **Layer 6**: Partial Lyric Match (scoring subset token overlap ratios on unique query tokens).
  - **Layer 7**: Combined Similarity Rank scoring and sorting.

---

### Bible Search Layer

#### [MODIFY] [bible-parser.ts](file:///d:/My_Projects/VisionPro/src/lib/search/bible-parser.ts)
- Rewrite `searchBibleBook(query)` to implement the 4-priority search ranking:
  - **Priority 1**: Case-insensitive exact match of aliases.
  - **Priority 2**: Book prefix match.
  - **Priority 3**: Transliterated/normalized exact matches (collapsing vowels/consonants and stripping leading book numbers).
  - **Priority 4**: Transliterated/normalized prefix matches.
  - Returns `bookId` and confidence score.

#### [MODIFY] [bible.ts](file:///d:/My_Projects/VisionPro/src/server/bible.ts)
- Update `performBibleSearch(query, lang, limit)` to:
  - Match book suggestions first.
  - If a strong book match is found, return chapter verses of that book directly.
  - Only execute full-text verse search if no book matches the query.

---

## Verification Plan

### Automated Tests
- Create a test runner script to run all 11 acceptance queries and verify that they resolve correctly.
- Assert that search execution times remain below 5ms.

### Manual Verification
- Launch the application dev server (`npm run dev`) and test search queries in the user interface.
