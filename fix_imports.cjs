const fs = require('fs');

let sp = fs.readFileSync('src/features/songs/SongsPanel.tsx', 'utf8');
sp = sp.replace('import { type Song } from "@/lib/songs/loader";', 'import { getSongs, type Song } from "@/lib/songs/loader";');
sp = sp.replace('const merged = serverHits.map((s: any) => userSongs.find(u => u.id === s.id) || s);', 'const merged = serverHits.map((s: any) => (userSongs.find(u => u.id === s.id) as any) || s);');
sp = sp.replace('const filteredHits = merged.filter(applyFilter).map((s: any) => ({ song: s, score: 0, slideIndex: 0, matched: [] }));', 'const filteredHits = merged.filter(s => applyFilter(s as any)).map((s: any) => ({ song: s, score: 0, slideIndex: 0, matched: [] }));');
fs.writeFileSync('src/features/songs/SongsPanel.tsx', sp);

let bp = fs.readFileSync('src/features/bible/BiblePanel.tsx', 'utf8');
bp = bp.replace('import { type BibleLang } from "@/lib/bible/loader";', 'import { getBible, type BibleLang } from "@/lib/bible/loader";');
bp = bp.replace('import { BIBLE_BOOKS_META } from "@/lib/bible/books";', 'import { BIBLE_BOOKS } from "@/lib/bible/books";');
fs.writeFileSync('src/features/bible/BiblePanel.tsx', bp);
console.log('Fixed imports!');
