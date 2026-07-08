import { getTamilSongsDb, query, run, isUsingRemote } from './sqlite';
import { transliterate, normalizeText, buildSearchKeywords } from '../server/songs';

async function runMigration() {
  // On a remote (Turso) database the dataset is seeded once via the seed
  // script, so we must not run this local migration (it would rewrite the DB
  // on every cold start).
  if (isUsingRemote()) {
    console.log('[migration] Remote DB detected — skipping local migration.');
    return;
  }

  const db = await getTamilSongsDb();

  console.log('--- Starting Search Redesign Database Migration ---');

  // 1. Add columns if they do not exist
  const columns = await query<{ name: string }>(db, 'PRAGMA table_info(songs)');
  const existing = new Set(columns.map(c => c.name));
  const requiredColumns = [
    { name: 'lyrics', type: 'TEXT' },
    { name: 'normalized_lyrics', type: 'TEXT' },
    { name: 'tanglish_title', type: 'TEXT' },
    { name: 'tanglish_lyrics', type: 'TEXT' },
    { name: 'normalized_tanglish_lyrics', type: 'TEXT' },
    { name: 'search_keywords', type: 'TEXT' },
  ];

  for (const rc of requiredColumns) {
    if (!existing.has(rc.name)) {
      console.log(`Adding ${rc.name} column to songs table...`);
      await run(db, `ALTER TABLE songs ADD COLUMN ${rc.name} ${rc.type};`);
    }
  }

  // 2. Fetch all songs
  const songs = await query<{ id: number, title: string, content: string }>(
    db,
    'SELECT id, title, content FROM songs',
  );
  console.log(`Found ${songs.length} songs. Generating and populating search indexes...`);

  // 3. Update songs table (wrapped in a transaction)
  const updateSql = `
    UPDATE songs
    SET lyrics = ?,
        normalized_lyrics = ?,
        tanglish_title = ?,
        tanglish_lyrics = ?,
        normalized_tanglish_lyrics = ?,
        search_keywords = ?
    WHERE id = ?
  `;

  await run(db, 'BEGIN');
  try {
    for (const song of songs) {
      const title = song.title || '';
      const content = song.content || '';

      const lyrics = content.replace(/\r\n/g, '\n').trim();
      const normalized_lyrics = (
        title.toLowerCase().replace(/[^a-z0-9\u0B80-\u0BFF]/g, ' ') + ' ' +
        content.toLowerCase().replace(/[^a-z0-9\u0B80-\u0BFF]/g, ' ')
      ).replace(/\s+/g, ' ').trim();

      const tanglish_title = transliterate(title);
      const tanglish_lyrics = transliterate(content);

      const normalized_tanglish_lyrics = (
        normalizeText(tanglish_title) + ' ' + normalizeText(tanglish_lyrics)
      ).trim();

      const search_keywords = buildSearchKeywords(title, content);

      await run(db, updateSql, [
        lyrics,
        normalized_lyrics,
        tanglish_title,
        tanglish_lyrics,
        normalized_tanglish_lyrics,
        search_keywords,
        song.id,
      ]);
    }
    await run(db, 'COMMIT');
  } catch (err) {
    await run(db, 'ROLLBACK');
    throw err;
  }

  console.log(`Updated ${songs.length} rows with new search columns.`);

  // 4. Rebuild FTS table
  console.log('Rebuilding songs_fts virtual table...');
  await run(db, 'DROP TABLE IF EXISTS songs_fts;');
  await run(db, `
    CREATE VIRTUAL TABLE songs_fts USING fts5(
        title,
        search_keywords,
        lyrics,
        content=songs,
        content_rowid=id,
        tokenize='trigram'
    );
  `);
  const ftsInfo = await run(db, `
    INSERT INTO songs_fts(rowid, title, search_keywords, lyrics)
    SELECT id, title, search_keywords, lyrics FROM songs
  `);

  console.log('--- Migration Complete ---');
}

// Run the migration
runMigration().catch((err) => console.error('Tanglish migration failed:', err));
