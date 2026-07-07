const fs = require('fs');
const path = require('path');

const songsPanelPath = path.join(__dirname, 'src/features/songs/SongsPanel.tsx');
let songsPanel = fs.readFileSync(songsPanelPath, 'utf8');

// Replace SongsPanel imports
songsPanel = songsPanel.replace(
  'import { getSongs, type Song } from "@/lib/songs/loader";',
  'import { type Song } from "@/lib/songs/loader";\nimport { searchSongsFn, getSongsByIdsFn } from "@/server/songs";'
);
songsPanel = songsPanel.replace(
  'import { searchSongs, type SongHit } from "@/lib/songs/search";',
  'import { type SongHit } from "@/lib/songs/search";'
);

// Replace SongsPanel useEffect for search
const oldEffectSongs = `  useEffect(() => {
    if (!loaded) return;
    const songs = getSongs();
    if (!songs) return;
    const q = query.trim();
    const favIds = new Set(favorites.map((f) => f.id));
    const userIds = new Set(userSongs.map((u) => u.id));
    const recentIds = new Set(recent.map((r) => r.songId));
    const applyFilter = (s: Song) => {
      if (filter === "favorites") return favIds.has(s.id);
      if (filter === "mine") return userIds.has(s.id);
      if (filter === "recent") return recentIds.has(s.id);
      if (filter === "added") return userIds.has(s.id);
      if (filter === "most") return (counts[s.id] ?? 0) > 0;
      if (filter === "author") return !!authorFilter && (s.artist || "").trim() === authorFilter;
      return true;
    };

    if (!q) {
      const out: SongHit[] = [];
      const seen = new Set<number>();
      const push = (s: Song, slideIndex = 0) => {
        if (seen.has(s.id) || !applyFilter(s)) return;
        out.push({ song: s, score: 0, slideIndex, matched: [] });
        seen.add(s.id);
      };
      if (filter === "all" || filter === "mine" || filter === "added") {
        const list = filter === "added"
          ? [...userSongs].sort((a, b) => b.id - a.id) // higher id = newer
          : userSongs;
        for (const u of list) {
          const s = songs.find((x) => x.id === u.id);
          if (s) push(s);
        }
      }
      if (filter === "all" || filter === "recent") {
        for (const r of recent) {
          const s = songs.find((x) => x.id === r.songId);
          if (s) push(s, r.slideIndex);
        }
      }
      if (filter === "most") {
        const ranked = Object.entries(counts)
          .map(([id, n]) => ({ id: Number(id), n }))
          .sort((a, b) => b.n - a.n);
        for (const r of ranked) {
          const s = songs.find((x) => x.id === r.id);
          if (s) push(s);
        }
      }
      if (filter === "favorites") {
        for (const f of favorites) {
          const s = songs.find((x) => x.id === f.id);
          if (s) push(s);
        }
      }
      if (filter === "author" && authorFilter) {
        for (const s of songs) push(s);
      }
      const limit = filter === "all" ? 80 : 500;
      if (filter === "all") {
        for (let i = 0; i < songs.length && out.length < limit; i++) push(songs[i]);
      }
      setResults(out);
      setSearchMs(null);
      setActiveIdx(0);
      return;
    }
    const t0 = performance.now();
    const hits = searchSongs(q, songs, 200).filter((h) => applyFilter(h.song)).slice(0, 120);
    setSearchMs(performance.now() - t0);
    setResults(hits);
    setActiveIdx(0);
  }, [query, loaded, recent, userSongs, favorites, filter, authorFilter, counts]);`;

const newEffectSongs = `  useEffect(() => {
    let canceled = false;
    const q = query.trim();
    const favIds = new Set(favorites.map((f) => f.id));
    const userIds = new Set(userSongs.map((u) => u.id));
    const recentIds = new Set(recent.map((r) => r.songId));
    
    const applyFilter = (s: Song) => {
      if (filter === "favorites") return favIds.has(s.id);
      if (filter === "mine") return userIds.has(s.id);
      if (filter === "recent") return recentIds.has(s.id);
      if (filter === "added") return userIds.has(s.id);
      if (filter === "most") return (counts[s.id] ?? 0) > 0;
      if (filter === "author") return !!authorFilter && (s.artist || "").trim() === authorFilter;
      return true;
    };

    async function fetchResults() {
      if (!q) {
        // Collect required remote IDs
        const remoteIdsToFetch = new Set<number>();
        if (filter === "all" || filter === "recent") recent.forEach(r => remoteIdsToFetch.add(r.songId));
        if (filter === "most") Object.keys(counts).forEach(id => remoteIdsToFetch.add(Number(id)));
        if (filter === "favorites" || filter === "all") favorites.forEach(f => remoteIdsToFetch.add(f.id));
        
        let remoteSongs: Song[] = [];
        if (remoteIdsToFetch.size > 0) {
          remoteSongs = await getSongsByIdsFn({ data: { ids: Array.from(remoteIdsToFetch).slice(0, 200) } }) as any;
        }
        if (canceled) return;

        const out: SongHit[] = [];
        const seen = new Set<number>();
        const push = (s: Song, slideIndex = 0) => {
          if (seen.has(s.id) || !applyFilter(s)) return;
          out.push({ song: s, score: 0, slideIndex, matched: [] });
          seen.add(s.id);
        };

        const allSongs = [...userSongs, ...remoteSongs];
        
        if (filter === "all" || filter === "mine" || filter === "added") {
          const list = filter === "added" ? [...userSongs].sort((a, b) => b.id - a.id) : userSongs;
          list.forEach(u => push(u as any));
        }
        if (filter === "all" || filter === "recent") {
          recent.forEach(r => { const s = allSongs.find(x => x.id === r.songId); if (s) push(s, r.slideIndex); });
        }
        if (filter === "favorites") {
          favorites.forEach(f => { const s = allSongs.find(x => x.id === f.id); if (s) push(s); });
        }
        
        setResults(out.slice(0, 80));
        setSearchMs(null);
        setActiveIdx(0);
      } else {
        const t0 = performance.now();
        const serverHits = await searchSongsFn({ data: { query: q } }) as any;
        if (canceled) return;
        
        const merged = serverHits.map((s: any) => userSongs.find(u => u.id === s.id) || s);
        const filteredHits = merged.filter(applyFilter).map((s: any) => ({ song: s, score: 0, slideIndex: 0, matched: [] }));
        
        setSearchMs(performance.now() - t0);
        setResults(filteredHits);
        setActiveIdx(0);
      }
    }

    const debounce = setTimeout(fetchResults, q ? 150 : 0);
    return () => { canceled = true; clearTimeout(debounce); };
  }, [query, recent, userSongs, favorites, filter, authorFilter, counts]);`;

songsPanel = songsPanel.replace(oldEffectSongs, newEffectSongs);

// Also fix getSongs()?.find in selectedSong:
songsPanel = songsPanel.replace(
`  const selectedSong: Song | null = useMemo(() => {
    if (!selectedSongId) return null;
    const songs = getSongs();
    return songs?.find((s) => s.id === selectedSongId) ?? null;
  }, [selectedSongId, userSongs, loaded]);`,
`  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  useEffect(() => {
    if (!selectedSongId) { setSelectedSong(null); return; }
    const userMatch = userSongs.find(u => u.id === selectedSongId);
    if (userMatch) { setSelectedSong(userMatch as any); return; }
    // Fetch if it's a remote song that isn't cached in results
    const inResults = results.find(r => r.song.id === selectedSongId);
    if (inResults) { setSelectedSong(inResults.song); return; }
    
    getSongsByIdsFn({ data: { ids: [selectedSongId] } }).then(res => {
      if (res && res[0]) setSelectedSong(res[0] as any);
    });
  }, [selectedSongId, userSongs, results]);`
);

fs.writeFileSync(songsPanelPath, songsPanel);

const biblePanelPath = path.join(__dirname, 'src/features/bible/BiblePanel.tsx');
let biblePanel = fs.readFileSync(biblePanelPath, 'utf8');

biblePanel = biblePanel.replace(
  'import { getBible, type BibleLang } from "@/lib/bible/loader";',
  'import { type BibleLang } from "@/lib/bible/loader";\nimport { searchBibleFn, getBibleChapterFn } from "@/server/bible";\nimport { BIBLE_BOOKS_META } from "@/lib/bible/books";'
);
biblePanel = biblePanel.replace(
  'import { search, parseReference, getChapterVerses, type VerseHit } from "@/lib/bible/search";',
  'import { parseReference, type VerseHit } from "@/lib/bible/search";'
);

const oldBibleEffect = `  // Build display list whenever query / lang / mode / data change.
  useEffect(() => {
    const primary: BibleLang = displayMode === "ta" ? "ta" : "en";
    const other: BibleLang | null = displayMode === "both" ? (primary === "en" ? "ta" : "en") : null;
    if (!loaded[primary] || (other && !loaded[other])) return;

    const dataPrimary = getBible(primary);
    const dataOther = other ? getBible(other) : null;
    if (!dataPrimary) return;

    const buildPair = (h: VerseHit): VerseHit | undefined => {
      if (!dataOther || !other) return undefined;
      const t = dataOther[h.book]?.[h.chapter - 1]?.[h.verse - 1];
      if (!t) return undefined;
      const meta = BIBLE_BOOKS[h.book];
      return {
        book: h.book, bookName: meta.name,
        bookNameLocal: other === "ta" ? meta.nameTa : meta.name,
        chapter: h.chapter, verse: h.verse, text: t, score: 0,
      };
    };

    const q = query.trim();
    const queryChanged = q !== lastQueryRef.current;
    lastQueryRef.current = q;

    if (!q) {
      // Recent verses first; fall back to a couple of featured defaults.
      const out: DisplayHit[] = [];
      const seen = new Set<string>();
      for (const r of recent) {
        const t = dataPrimary[r.book]?.[r.chapter - 1]?.[r.verse - 1];
        if (!t) continue;
        const meta = BIBLE_BOOKS[r.book];
        const hit: VerseHit = {
          book: r.book, bookName: meta.name,
          bookNameLocal: primary === "ta" ? meta.nameTa : meta.name,
          chapter: r.chapter, verse: r.verse, text: t, score: 0,
        };
        out.push({ hit, pair: buildPair(hit) });
        seen.add(favKey(r.book, r.chapter, r.verse));
      }
      if (out.length === 0) {
        const fHits = [{ b: 42, c: 3, v: 16 }, { b: 18, c: 23, v: 1 }, { b: 0, c: 1, v: 1 }];
        for (const f of fHits) {
          const t = dataPrimary[f.b]?.[f.c - 1]?.[f.v - 1];
          if (!t) continue;
          const meta = BIBLE_BOOKS[f.b];
          const hit: VerseHit = {
            book: f.b, bookName: meta.name,
            bookNameLocal: primary === "ta" ? meta.nameTa : meta.name,
            chapter: f.c, verse: f.v, text: t, score: 0,
          };
          out.push({ hit, pair: buildPair(hit) });
        }
      }
      setResults(out);
      setSearchMs(null);
      setChapterCtx(null);
      if (queryChanged) { setActiveIdx(0); selectedKeyRef.current = null; }
      return;
    }

    const start = performance.now();
    let primaryHits: VerseHit[];

    if (searchMode === "reference") {
      const ref = parseReference(q);
      if (ref && ref.chapter != null && ref.verse == null) {
        primaryHits = getChapterVerses(ref.book.index, ref.chapter, dataPrimary, primary);
        setChapterCtx({ book: ref.book.index, chapter: ref.chapter });
      } else if (ref) {
        primaryHits = search(q, dataPrimary, primary, 200);
        setChapterCtx(ref.chapter != null ? { book: ref.book.index, chapter: ref.chapter } : null);
      } else {
        primaryHits = search(q, dataPrimary, primary, 80);
        setChapterCtx(null);
      }
    } else {
      // Verse text search — includes fuzzy/Tanglish via search().
      primaryHits = search(q, dataPrimary, primary, 200);
      setChapterCtx(null);
    }

    const list: DisplayHit[] = primaryHits.map((h) => ({ hit: h, pair: buildPair(h) }));
    setSearchMs(performance.now() - start);
    setResults(list);

    if (queryChanged) {
      setActiveIdx(0);
      selectedKeyRef.current = list[0] ? favKey(list[0].hit.book, list[0].hit.chapter, list[0].hit.verse) : null;
    } else if (selectedKeyRef.current) {
      const idx = list.findIndex((d) => favKey(d.hit.book, d.hit.chapter, d.hit.verse) === selectedKeyRef.current);
      if (idx >= 0) setActiveIdx(idx);
    }
  }, [query, loaded, displayMode, lang, searchMode, recent]);`;

const newBibleEffect = `  useEffect(() => {
    let canceled = false;
    const primary: BibleLang = displayMode === "ta" ? "ta" : "en";
    const other: BibleLang | null = displayMode === "both" ? (primary === "en" ? "ta" : "en") : null;
    const q = query.trim();
    const queryChanged = q !== lastQueryRef.current;
    lastQueryRef.current = q;

    async function fetchResults() {
      if (!q) {
        const out: DisplayHit[] = [];
        for (const r of recent) {
          const meta = BIBLE_BOOKS[r.book];
          out.push({
            hit: { book: r.book, bookName: meta.name, bookNameLocal: primary === "ta" ? meta.nameTa : meta.name, chapter: r.chapter, verse: r.verse, text: r.text, score: 0 }
          });
        }
        if (!canceled) {
          setResults(out); setSearchMs(null); setChapterCtx(null);
          if (queryChanged) { setActiveIdx(0); selectedKeyRef.current = null; }
        }
        return;
      }

      const t0 = performance.now();
      const res = await searchBibleFn({ data: { query: q, lang: displayMode } }) as any;
      if (canceled) return;

      const list: DisplayHit[] = res.hits.map((h: any) => {
        const meta = BIBLE_BOOKS[h.book];
        const hit: VerseHit = {
          book: h.book, bookName: meta.name, bookNameLocal: primary === "ta" ? meta.nameTa : meta.name,
          chapter: h.chapter, verse: h.verse, text: h.text, score: 0
        };
        let pair: VerseHit | undefined = undefined;
        if (h.pairText && other) {
          pair = {
            book: h.book, bookName: meta.name, bookNameLocal: other === "ta" ? meta.nameTa : meta.name,
            chapter: h.chapter, verse: h.verse, text: h.pairText, score: 0
          };
        }
        return { hit, pair };
      });

      setSearchMs(performance.now() - t0);
      setResults(list);
      setChapterCtx(res.chapterCtx || null);
      if (queryChanged) {
        setActiveIdx(0);
        selectedKeyRef.current = list[0] ? favKey(list[0].hit.book, list[0].hit.chapter, list[0].hit.verse) : null;
      } else if (selectedKeyRef.current) {
        const idx = list.findIndex((d) => favKey(d.hit.book, d.hit.chapter, d.hit.verse) === selectedKeyRef.current);
        if (idx >= 0) setActiveIdx(idx);
      }
    }

    const debounce = setTimeout(fetchResults, q ? 150 : 0);
    return () => { canceled = true; clearTimeout(debounce); };
  }, [query, displayMode, lang, searchMode, recent]);`;

biblePanel = biblePanel.replace(oldBibleEffect, newBibleEffect);

fs.writeFileSync(biblePanelPath, biblePanel);
console.log("Refactoring completed successfully.");
