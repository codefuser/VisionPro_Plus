const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'data/tamilsongs.sqlite');
const db = new Database(dbPath);

console.log("=== Song Search Audit ===");

// 1. Verify tanglish_lyrics column exists
const columns = db.prepare("PRAGMA table_info(songs)").all();
const hasTanglishLyrics = columns.some(c => c.name === 'tanglish_lyrics');
console.log(`tanglish_lyrics column exists: ${hasTanglishLyrics}`);

// 2. Count rows where tanglish_lyrics is populated
if (hasTanglishLyrics) {
  const count = db.prepare("SELECT count(*) as c FROM songs WHERE tanglish_lyrics IS NOT NULL").get();
  console.log(`Populated tanglish_lyrics rows: ${count.c}`);
  
  // 3. Print sample rows
  const samples = db.prepare("SELECT title, content, tanglish_lyrics FROM songs WHERE content LIKE '%இயேசுவே%' LIMIT 2").all();
  console.log("\nSample Rows:");
  samples.forEach((s, i) => {
    console.log(`\nSample ${i+1}:`);
    console.log(`Title: ${s.title}`);
    console.log(`Original: ${s.content.substring(0, 100)}...`);
    console.log(`Tanglish: ${s.tanglish_lyrics.substring(0, 100)}...`);
  });
}

// 4. Test FTS query
try {
  const ftsCount = db.prepare("SELECT count(*) as c FROM songs_fts WHERE songs_fts MATCH 'yesu*'").get();
  console.log(`\nFTS 'yesu*' hits: ${ftsCount.c}`);
} catch (e) {
  console.log(`FTS error: ${e.message}`);
}
