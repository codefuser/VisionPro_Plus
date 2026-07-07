import { getEnglishBibleDb, getTamilBibleDb } from '../db/sqlite';
import { parseBibleReference, searchBibleBook } from '../lib/search/bible-parser';

export async function getBibleChapter(book: number, chapter: number) {
    const data = { book, chapter };
    const enDb = getEnglishBibleDb();
    const taDb = getTamilBibleDb();
    
    const enRows = enDb.prepare(`SELECT Versecount, verse FROM bible WHERE Book = ? AND Chapter = ? ORDER BY Versecount ASC`).all(data.book, data.chapter) as { Versecount: number, verse: string }[];
    const taRows = taDb.prepare(`SELECT Versecount, verse FROM bible WHERE Book = ? AND Chapter = ? ORDER BY Versecount ASC`).all(data.book, data.chapter) as { Versecount: number, verse: string }[];
    
    return {
      en: enRows.map(r => ({ verse: r.Versecount, text: r.verse })),
      ta: taRows.map(r => ({ verse: r.Versecount, text: r.verse }))
    };
}

export async function getAllBible(lang: 'en' | 'ta') {
    const data = { lang };
    const db = data.lang === 'ta' ? getTamilBibleDb() : getEnglishBibleDb();
    const rows = db.prepare(`SELECT Book, Chapter, Versecount, verse FROM bible ORDER BY Book, Chapter, Versecount`).all() as any[];
    
    const dataArr: string[][][] = [];
    for (const r of rows) {
      const bookIdx = r.Book - 1;
      if (!dataArr[bookIdx]) dataArr[bookIdx] = [];
      const b = dataArr[bookIdx];
      if (!b[r.Chapter - 1]) b[r.Chapter - 1] = [];
      const c = b[r.Chapter - 1];
      c[r.Versecount - 1] = r.verse;
    }
    return dataArr;
}

export function performBibleSearch(query: string, lang: 'en' | 'ta' | 'both', limit: number) {
  const trimmed = query.trim();
  if (!trimmed) return { hits: [], mode: 'text', confidence: 0 };

  const parsed = parseBibleReference(trimmed);
  const primaryDb = lang === 'ta' ? getTamilBibleDb() : getEnglishBibleDb();
  const secondaryDb = lang === 'both' ? getTamilBibleDb() : null;

  let primaryRows: { Book: number, Chapter: number, Versecount: number, verse: string }[] = [];

  // 1. Reference Search
  if (parsed && parsed.chapter != null) {
    if (parsed.verse != null) {
      // Exact Verse
      primaryRows = primaryDb.prepare(`SELECT Book, Chapter, Versecount, verse FROM bible WHERE Book = ? AND Chapter = ? AND Versecount = ?`).all(parsed.book, parsed.chapter, parsed.verse) as any;
    } else {
      // Entire Chapter
      primaryRows = primaryDb.prepare(`SELECT Book, Chapter, Versecount, verse FROM bible WHERE Book = ? AND Chapter = ? ORDER BY Versecount ASC`).all(parsed.book, parsed.chapter) as any;
    }
    
    const results = primaryRows.map(p => {
      let pair: any = undefined;
      if (secondaryDb) {
        pair = secondaryDb.prepare(`SELECT verse FROM bible WHERE Book = ? AND Chapter = ? AND Versecount = ?`).get(p.Book, p.Chapter, p.Versecount) as any;
      }
      return {
        book: p.Book,
        chapter: p.Chapter,
        verse: p.Versecount,
        text: p.verse,
        pairText: pair ? pair.verse : undefined
      };
    });
    
    return { hits: results, mode: 'reference', chapterCtx: { book: parsed.book, chapter: parsed.chapter }, confidence: 1.0 };
  }

  // 2. Book Search (Strong Match Check First)
  const bookMatch = searchBibleBook(trimmed);
  if (bookMatch && bookMatch.score >= 0.75) {
    primaryRows = primaryDb.prepare(`SELECT Book, Chapter, Versecount, verse FROM bible WHERE Book = ? AND Chapter = ? ORDER BY Versecount ASC`).all(bookMatch.bookId, 1) as any;
    
    const results = primaryRows.map(p => {
      let pair: any = undefined;
      if (secondaryDb) {
        pair = secondaryDb.prepare(`SELECT verse FROM bible WHERE Book = ? AND Chapter = ? AND Versecount = ?`).get(p.Book, p.Chapter, p.Versecount) as any;
      }
      return {
        book: p.Book,
        chapter: p.Chapter,
        verse: p.Versecount,
        text: p.verse,
        pairText: pair ? pair.verse : undefined
      };
    });
    
    return { hits: results, mode: 'reference', chapterCtx: { book: bookMatch.bookId, chapter: 1 }, confidence: bookMatch.score };
  }

  // 3. FTS5 Text Search (Fallback)
  const safeTerm = trimmed.replace(/"/g, '').replace(/'/g, '');
  const ftsQuery = `"${safeTerm}" *`;
  
  primaryRows = primaryDb.prepare(`
    SELECT Book, Chapter, Versecount, verse
    FROM bible_fts
    WHERE bible_fts MATCH 'verse:${ftsQuery}'
    LIMIT ?
  `).all(limit) as any;

  const results = primaryRows.map(p => {
    let pair: any = undefined;
    if (secondaryDb) {
      pair = secondaryDb.prepare(`SELECT verse FROM bible WHERE Book = ? AND Chapter = ? AND Versecount = ?`).get(p.Book, p.Chapter, p.Versecount) as any;
    }
    return {
      book: p.Book,
      chapter: p.Chapter,
      verse: p.Versecount,
      text: p.verse,
      pairText: pair ? pair.verse : undefined
    };
  });

  return { hits: results, mode: 'text', confidence: 0.5 };
}
