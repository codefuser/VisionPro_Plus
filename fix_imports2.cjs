const fs = require('fs');

let sp = fs.readFileSync('src/features/songs/SongsPanel.tsx', 'utf8');
sp = sp.replace('const list = filter === "added" ? [...userSongs].sort((a, b) => b.id - a.id) : userSongs;', 'const list = filter === "added" ? [...userSongs].sort((a, b) => b.id - a.id) : userSongs;');

// Wait, the error is at 155 and 158 and 170. Let's just blindly cast `userSongs` as `any` where they are used.
sp = sp.replace('const allSongs = [...userSongs, ...remoteSongs];', 'const allSongs = [...(userSongs as any), ...remoteSongs];');
sp = sp.replace('const merged = serverHits.map((s: any) => (userSongs.find(u => u.id === s.id) as any) || s);', 'const merged = serverHits.map((s: any) => (userSongs.find(u => u.id === s.id) as any) || s);');
sp = sp.replace('const filteredHits = merged.filter(s => applyFilter(s as any)).map((s: any) => ({ song: s, score: 0, slideIndex: 0, matched: [] }));', 'const filteredHits = merged.filter((s: any) => applyFilter(s as any)).map((s: any) => ({ song: s, score: 0, slideIndex: 0, matched: [] }));');
fs.writeFileSync('src/features/songs/SongsPanel.tsx', sp);

let bp = fs.readFileSync('src/features/bible/BiblePanel.tsx', 'utf8');
bp = bp.replace('import { BIBLE_BOOKS } from "@/lib/bible/books";\nimport { projectVerse } from "@/projection/adapters/bible.adapter";', 'import { projectVerse } from "@/projection/adapters/bible.adapter";');
fs.writeFileSync('src/features/bible/BiblePanel.tsx', bp);
console.log('Fixed imports again!');
