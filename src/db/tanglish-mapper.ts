import { getTamilSongsDb } from './sqlite';
import { transliterate, normalizeText } from '../server/songs';

function runMigration() {
  const db = getTamilSongsDb();
  
  console.log("--- Starting Search Redesign Database Migration ---");
  
  // 1. Add columns if they do not exist
  const columns = db.prepare("PRAGMA table_info(songs)").all() as any[];
  const requiredColumns = [
    { name: 'lyrics', type: 'TEXT' },
    { name: 'normalized_lyrics', type: 'TEXT' },
    { name: 'tanglish_title', type: 'TEXT' },
    { name: 'tanglish_lyrics', type: 'TEXT' },
    { name: 'normalized_tanglish_lyrics', type: 'TEXT' }
  ];
  
  for (const rc of requiredColumns) {
    if (!columns.find(c => c.name === rc.name)) {
      console.log(`Adding ${rc.name} column to songs table...`);
      db.exec(`ALTER TABLE songs ADD COLUMN ${rc.name} ${rc.type};`);
    }
  }
  
  // 2. Fetch all songs
  const songs = db.prepare("SELECT id, title, content FROM songs").all() as {id: number, title: string, content: string}[];
  console.log(`Found ${songs.length} songs. Generating and populating search indexes...`);
  
  // 3. Update songs table
  let updatedCount = 0;
  const updateStmt = db.prepare(`
    UPDATE songs 
    SET lyrics = ?,
        normalized_lyrics = ?,
        tanglish_title = ?,
        tanglish_lyrics = ?,
        normalized_tanglish_lyrics = ?
    WHERE id = ?
  `);
  
  db.transaction(() => {
    for (const song of songs) {
      const title = song.title || '';
      const content = song.content || '';
      
      const lyrics = content.replace(/\r\n/g, '\n').trim();
      const normalized_lyrics = (title.toLowerCase().replace(/[^a-z0-9\u0B80-\u0BFF]/g, ' ') + ' ' + content.toLowerCase().replace(/[^a-z0-9\u0B80-\u0BFF]/g, ' ')).replace(/\s+/g, ' ').trim();
      
      const tanglish_title = transliterate(title);
      const tanglish_lyrics = transliterate(content);
      
      const normalized_tanglish_lyrics = (normalizeText(tanglish_title) + ' ' + normalizeText(tanglish_lyrics)).trim();
      
      updateStmt.run(
        lyrics,
        normalized_lyrics,
        tanglish_title,
        tanglish_lyrics,
        normalized_tanglish_lyrics,
        song.id
      );
      updatedCount++;
    }
  })();
  
  console.log(`Updated ${updatedCount} rows with new search columns.`);
  
  // 4. Rebuild FTS table
  console.log("Rebuilding songs_fts virtual table...");
  db.exec(`
    DROP TABLE IF EXISTS songs_fts;
    CREATE VIRTUAL TABLE songs_fts USING fts5(
        title,
        lyrics,
        normalized_lyrics,
        tanglish_title,
        tanglish_lyrics,
        normalized_tanglish_lyrics,
        content=songs,
        content_rowid=id,
        tokenize='unicode61'
    );
  `);
  
  const ftsInfo = db.prepare(`
    INSERT INTO songs_fts(rowid, title, lyrics, normalized_lyrics, tanglish_title, tanglish_lyrics, normalized_tanglish_lyrics) 
    SELECT id, title, lyrics, normalized_lyrics, tanglish_title, tanglish_lyrics, normalized_tanglish_lyrics FROM songs
  `).run();
  
  console.log(`Populated songs_fts virtual index with ${ftsInfo.changes} rows.`);
  console.log("--- Migration Complete ---");
}

// Run the migration
runMigration();
