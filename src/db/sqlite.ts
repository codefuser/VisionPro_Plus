import Database from 'better-sqlite3';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');

export const englishBibleDbPath = path.join(DATA_DIR, 'english_bible.db');
export const tamilBibleDbPath = path.join(DATA_DIR, 'tamil_bible.db');
export const tamilSongsDbPath = path.join(DATA_DIR, 'tamilsongs.sqlite');

function initDb(dbPath: string) {
  const db = new Database(dbPath, { readonly: false });
  
  // Configure SQLite for fast local reads
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('cache_size = -20000'); // 20MB cache
  
  return db;
}

let englishBibleDb: ReturnType<typeof Database> | null = null;
let tamilBibleDb: ReturnType<typeof Database> | null = null;
let tamilSongsDb: ReturnType<typeof Database> | null = null;

export function getEnglishBibleDb() {
  if (!englishBibleDb) englishBibleDb = initDb(englishBibleDbPath);
  return englishBibleDb;
}

export function getTamilBibleDb() {
  if (!tamilBibleDb) tamilBibleDb = initDb(tamilBibleDbPath);
  return tamilBibleDb;
}

export function getTamilSongsDb() {
  if (!tamilSongsDb) tamilSongsDb = initDb(tamilSongsDbPath);
  return tamilSongsDb;
}
