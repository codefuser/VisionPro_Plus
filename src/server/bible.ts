import { getEnglishBibleDb, getTamilBibleDb, query, queryOne } from '../db/sqlite';
import { parseBibleReference, searchBibleBook } from '../lib/search/bible-parser';

export async function getBibleChapter(book: number, chapter: number) {
  const data = { book, chapter };
  const enDb = await getEnglishBibleDb();
  const taDb = await getTamilBibleDb();

  const enRows = await query<{ Versecount: number, verse: string }>(
    enDb,
    `SELECT Versecount, verse FROM bible WHERE Book = ? AND Chapter = ? ORDER BY Versecount ASC`,
    [data.book, data.chapter],
  );
  const taRows = await query<{ Versecount: number, verse: string }>(
    taDb,
    `SELECT Versecount, verse FROM bible WHERE Book = ? AND Chapter = ? ORDER BY Versecount ASC`,
    [data.book, data.chapter],
  );

  return {
    en: enRows.map(r => ({ verse: r.Versecount, text: r.verse })),
    ta: taRows.map(r => ({ verse: r.Versecount, text: r.verse })),
  };
}

export async function getAllBible(lang: 'en' | 'ta') {
  const data = { lang };
  const db = data.lang === 'ta' ? await getTamilBibleDb() : await getEnglishBibleDb();
  const rows = await query<any>(
    db,
    `SELECT Book, Chapter, Versecount, verse FROM bible ORDER BY Book, Chapter, Versecount`,
  );

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

export async function performBibleSearch(queryStr: string, lang: 'en' | 'ta' | 'both', limit: number) {
  const trimmed = queryStr.trim();
  if (!trimmed) return { hits: [], mode: 'text', confidence: 0 };

  const parsed = parseBibleReference(trimmed);
  const primaryDb = lang === 'ta' ? await getTamilBibleDb() : await getEnglishBibleDb();
  const secondaryDb = lang === 'both' ? await getTamilBibleDb() : null;

  let primaryRows: { Book: number, Chapter: number, Versecount: number, verse: string }[] = [];

  // 1. Reference Search
  if (parsed && parsed.chapter != null) {
    if (parsed.verse != null) {
      // Exact Verse
      primaryRows = await query(
        primaryDb,
        `SELECT Book, Chapter, Versecount, verse FROM bible WHERE Book = ? AND Chapter = ? AND Versecount = ?`,
        [parsed.book, parsed.chapter, parsed.verse],
      );
    } else {
      // Entire Chapter
      primaryRows = await query(
        primaryDb,
        `SELECT Book, Chapter, Versecount, verse FROM bible WHERE Book = ? AND Chapter = ? ORDER BY Versecount ASC`,
        [parsed.book, parsed.chapter],
      );
    }

    const results = await Promise.all(primaryRows.map(async (p) => {
      let pair: any = undefined;
      if (secondaryDb) {
        pair = await queryOne(
          secondaryDb,
          `SELECT verse FROM bible WHERE Book = ? AND Chapter = ? AND Versecount = ?`,
          [p.Book, p.Chapter, p.Versecount],
        );
      }
      return {
        book: p.Book,
        chapter: p.Chapter,
        verse: p.Versecount,
        text: p.verse,
        pairText: pair ? pair.verse : undefined,
      };
    }));

    return { hits: results, mode: 'reference', chapterCtx: { book: parsed.book, chapter: parsed.chapter }, confidence: 1.0 };
  }

  // 2. Book Search (Strong Match Check First)
  const bookMatch = searchBibleBook(trimmed);
  if (bookMatch && bookMatch.score >= 0.75) {
    primaryRows = await query(
      primaryDb,
      `SELECT Book, Chapter, Versecount, verse FROM bible WHERE Book = ? AND Chapter = ? ORDER BY Versecount ASC`,
      [bookMatch.bookId, 1],
    );

    const results = await Promise.all(primaryRows.map(async (p) => {
      let pair: any = undefined;
      if (secondaryDb) {
        pair = await queryOne(
          secondaryDb,
          `SELECT verse FROM bible WHERE Book = ? AND Chapter = ? AND Versecount = ?`,
          [p.Book, p.Chapter, p.Versecount],
        );
      }
      return {
        book: p.Book,
        chapter: p.Chapter,
        verse: p.Versecount,
        text: p.verse,
        pairText: pair ? pair.verse : undefined,
      };
    }));

    return { hits: results, mode: 'reference', chapterCtx: { book: bookMatch.bookId, chapter: 1 }, confidence: bookMatch.score };
  }

  // 3. FTS5 Text Search (Fallback)
  const safeTerm = trimmed.replace(/"/g, '').replace(/'/g, '');
  const ftsQuery = `"${safeTerm}" *`;

  primaryRows = await query(
    primaryDb,
    `
    SELECT Book, Chapter, Versecount, verse
    FROM bible_fts
    WHERE bible_fts MATCH ?
    LIMIT ?
  `,
    [ftsQuery, limit],
  );

  const results = await Promise.all(primaryRows.map(async (p) => {
    let pair: any = undefined;
    if (secondaryDb) {
      pair = await queryOne(
        secondaryDb,
        `SELECT verse FROM bible WHERE Book = ? AND Chapter = ? AND Versecount = ?`,
        [p.Book, p.Chapter, p.Versecount],
      );
    }
    return {
      book: p.Book,
      chapter: p.Chapter,
      verse: p.Versecount,
      text: p.verse,
      pairText: pair ? pair.verse : undefined,
    };
  }));

  return { hits: results, mode: 'text', confidence: 0.5 };
}
