const fs = require('fs');
const path = require('path');

// 1. Refactor src/server/songs.ts
const serverSongsPath = path.join(__dirname, 'src/server/songs.ts');
let serverSongs = fs.readFileSync(serverSongsPath, 'utf8');
serverSongs = serverSongs.replace('"use server";\n', '');
serverSongs = serverSongs.replace(/import \{ createServerFn \} from '@tanstack\/react-start';\n/, '');

serverSongs = serverSongs.replace(
`export const getSongsByIdsFn = createServerFn({ method: 'GET' })
  .validator((d: { ids: number[] }) => d)
  .handler(async ({ data }) => {`,
`export async function getSongsByIds(ids: number[]) {
    const data = { ids };`
);
serverSongs = serverSongs.replace(
`      slides: (r.content || '').split(/\\n\\s*\\n+/).map((s: string) => s.trim()).filter(Boolean)
    }));
  });`,
`      slides: (r.content || '').split(/\\n\\s*\\n+/).map((s: string) => s.trim()).filter(Boolean)
    }));
}`
);

serverSongs = serverSongs.replace(
`export const getAllSongsFn = createServerFn({ method: 'GET' })
  .handler(async () => {`,
`export async function getAllSongs() {`
);
serverSongs = serverSongs.replace(
`      artist: r.artist || '', album: r.album || '', scale: r.scale || ''
    }));
  });`,
`      artist: r.artist || '', album: r.album || '', scale: r.scale || ''
    }));
}`
);

serverSongs = serverSongs.replace(
`export const searchSongsFn = createServerFn({ method: 'GET' })
  .validator((d: { query: string }) => d)
  .handler(async ({ data }) => {
    return performSongSearch(data.query);
  });`,
``
);

fs.writeFileSync(serverSongsPath, serverSongs);

// 2. Create src/lib/songs/actions.ts
const songsActionsCode = `import { createServerFn } from '@tanstack/react-start';

export const searchSongsFn = createServerFn({ method: 'GET' })
  .validator((d: { query: string }) => d)
  .handler(async ({ data }) => {
    const { performSongSearch } = await import('@/server/songs');
    return performSongSearch(data.query);
  });

export const getSongsByIdsFn = createServerFn({ method: 'GET' })
  .validator((d: { ids: number[] }) => d)
  .handler(async ({ data }) => {
    const { getSongsByIds } = await import('@/server/songs');
    return getSongsByIds(data.ids);
  });

export const getAllSongsFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const { getAllSongs } = await import('@/server/songs');
    return getAllSongs();
  });
`;
fs.writeFileSync(path.join(__dirname, 'src/lib/songs/actions.ts'), songsActionsCode);

// 3. Refactor src/server/bible.ts
const serverBiblePath = path.join(__dirname, 'src/server/bible.ts');
let serverBible = fs.readFileSync(serverBiblePath, 'utf8');
serverBible = serverBible.replace('"use server";\n', '');
serverBible = serverBible.replace(/import \{ createServerFn \} from '@tanstack\/react-start';\n/, '');

serverBible = serverBible.replace(
`export const searchBibleFn = createServerFn({ method: 'GET' })
  .validator((d: { query: string; lang: 'en' | 'ta' | 'both'; limit?: number }) => d)
  .handler(async ({ data }) => {
    return performBibleSearch(data.query, data.lang, data.limit || 80);
  });`,
``
);

serverBible = serverBible.replace(
`export const getBibleChapterFn = createServerFn({ method: 'GET' })
  .validator((d: { book: number; chapter: number }) => d)
  .handler(async ({ data }) => {`,
`export async function getBibleChapter(book: number, chapter: number) {
    const data = { book, chapter };`
);
serverBible = serverBible.replace(
`      en: enRows.map(r => ({ verse: r.Versecount, text: r.verse })),
      ta: taRows.map(r => ({ verse: r.Versecount, text: r.verse }))
    };
  });`,
`      en: enRows.map(r => ({ verse: r.Versecount, text: r.verse })),
      ta: taRows.map(r => ({ verse: r.Versecount, text: r.verse }))
    };
}`
);

serverBible = serverBible.replace(
`export const getAllBibleFn = createServerFn({ method: 'GET' })
  .validator((d: { lang: 'en' | 'ta' }) => d)
  .handler(async ({ data }) => {`,
`export async function getAllBible(lang: 'en' | 'ta') {
    const data = { lang };`
);
serverBible = serverBible.replace(
`      const c = b[r.Chapter - 1];
      c[r.Versecount - 1] = r.verse;
    }
    return dataArr;
  });`,
`      const c = b[r.Chapter - 1];
      c[r.Versecount - 1] = r.verse;
    }
    return dataArr;
}`
);

fs.writeFileSync(serverBiblePath, serverBible);

// 4. Create src/lib/bible/actions.ts
const bibleActionsCode = `import { createServerFn } from '@tanstack/react-start';

export const searchBibleFn = createServerFn({ method: 'GET' })
  .validator((d: { query: string; lang: 'en' | 'ta' | 'both'; limit?: number }) => d)
  .handler(async ({ data }) => {
    const { performBibleSearch } = await import('@/server/bible');
    return performBibleSearch(data.query, data.lang, data.limit || 80);
  });

export const getBibleChapterFn = createServerFn({ method: 'GET' })
  .validator((d: { book: number; chapter: number }) => d)
  .handler(async ({ data }) => {
    const { getBibleChapter } = await import('@/server/bible');
    return getBibleChapter(data.book, data.chapter);
  });

export const getAllBibleFn = createServerFn({ method: 'GET' })
  .validator((d: { lang: 'en' | 'ta' }) => d)
  .handler(async ({ data }) => {
    const { getAllBible } = await import('@/server/bible');
    return getAllBible(data.lang);
  });
`;
fs.writeFileSync(path.join(__dirname, 'src/lib/bible/actions.ts'), bibleActionsCode);

// 5. Update Imports
let songsPanel = fs.readFileSync(path.join(__dirname, 'src/features/songs/SongsPanel.tsx'), 'utf8');
songsPanel = songsPanel.replace(/from "@\/server\/songs"/g, 'from "@/lib/songs/actions"');
fs.writeFileSync(path.join(__dirname, 'src/features/songs/SongsPanel.tsx'), songsPanel);

let songsLoader = fs.readFileSync(path.join(__dirname, 'src/lib/songs/loader.ts'), 'utf8');
songsLoader = songsLoader.replace(/from "@\/server\/songs"/g, 'from "@/lib/songs/actions"');
fs.writeFileSync(path.join(__dirname, 'src/lib/songs/loader.ts'), songsLoader);

let biblePanel = fs.readFileSync(path.join(__dirname, 'src/features/bible/BiblePanel.tsx'), 'utf8');
biblePanel = biblePanel.replace(/from "@\/server\/bible"/g, 'from "@/lib/bible/actions"');
fs.writeFileSync(path.join(__dirname, 'src/features/bible/BiblePanel.tsx'), biblePanel);

let bibleLoader = fs.readFileSync(path.join(__dirname, 'src/lib/bible/loader.ts'), 'utf8');
bibleLoader = bibleLoader.replace(/from "@\/server\/bible"/g, 'from "@/lib/bible/actions"');
fs.writeFileSync(path.join(__dirname, 'src/lib/bible/loader.ts'), bibleLoader);

console.log("Boundary fix applied.");
