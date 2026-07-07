# Phase 6: Search Quality and Projection Optimization

## Goal Description
Enhance the accuracy and tolerance of both Bible and Song searches, and improve the projection experience by introducing smart slide splitting logic that ensures slides are readable and properly chunked.

## User Review Required
> [!IMPORTANT]
> The Tanglish lyrics generation requires adding a new `tanglish_lyrics` column to the `songs` SQLite database and rebuilding the `songs_fts` virtual table. The implementation plan includes an automated database migration script that will be run once. 
> Please review the slide splitting rules carefully: blocks of 5 lines will be split as 3+2, and 6 lines as 3+3 to avoid orphans. Blocks larger than 6 will be chunked into 4s.

## Open Questions
- None.

## Proposed Changes

### Database Layer
#### [NEW] `src/db/migrate-tanglish.ts`
- Script to `ALTER TABLE songs ADD COLUMN tanglish_lyrics TEXT`.
- Read all `content`, run a heavy phonetic normalization/transliteration process, and update `tanglish_lyrics`.
- Rebuild `songs_fts` to include the `tanglish_lyrics` column.

### Search Layer
#### [MODIFY] `src/lib/search/bible-parser.ts`
- Make the chapter match optional in the regex: `^(\d?\s*[a-z\u0B80-\u0BFF]+)(?:\s+(\d+)(?:\s*:\s*(\d+))?)?$`
- Default to chapter 1 if missing.
- Fallback to a `.startsWith()` scan over `bookMap` to match partial names (e.g., "sange" -> matches "sangeetham", "aathi" matches "aathiagamam").

#### [MODIFY] `src/server/songs.ts`
- Enhance `normalizeTanglishQuery()` with aggressive vowel and suffix stripping to collapse spelling variations (e.g., collapsing `vae`, `vey`, `va` to `ve`, and `nae`, `ney`, `na` to `ne`).
- Update the FTS5 match query to include the new `tanglish_lyrics` column.
- Update the SQLite query to use prefix matching `*` on individual query words to support partial/typo matching natively.

### Projection Engine
#### [MODIFY] `src/server/songs.ts`
- Replace `.split(/\n\s*\n+/)` logic inside `performSongSearch` and `getSongsByIds` with a new `smartSplitSlides(content)` function.
- **Rules**:
  - Split by empty lines first (stanzas/chorus blocks).
  - If a stanza is <= 4 lines, keep as one slide.
  - If 5 lines, split as 3 lines + 2 lines.
  - If 6 lines, split as 3 lines + 3 lines.
  - If > 6 lines, chunk into groups of 4.
  - Never split sentences (split strictly on `\n`).

## Verification Plan

### Automated Tests
- No new jest tests strictly required, but I can add some inline test logic inside the migration script to verify `smartSplitSlides`.

### Manual Verification
- Type "sange", "sang", "aathi" in the Bible search and verify it loads the first chapter of Psalms/Genesis.
- Type "appa pidavae anbanae" and "appa pidava anbane" in the Song search and verify it returns the same song via the `tanglish_lyrics` index.
- Check projection output for songs with 20+ lines and verify they are cleanly split into 3-4 line slides.
