import { getTamilSongsDb, query } from '../db/sqlite';

// Phonetic Tamil to Tanglish Mapper
const tamilMap: Record<string, string> = {
  'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ee', 'உ': 'u', 'ஊ': 'oo',
  'எ': 'e', 'ஏ': 'ye', 'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'o', 'ஔ': 'ou',
  'க்': 'k', 'க': 'ka', 'கா': 'kaa', 'கி': 'ki', 'கீ': 'kee', 'கு': 'ku', 'கூ': 'koo', 'கெ': 'ke', 'கே': 'ke', 'கை': 'kai', 'கொ': 'ko', 'கோ': 'ko', 'கௌ': 'kou',
  'ங்': 'ng', 'ங': 'nga', 'ஙா': 'ngaa', 'ஙி': 'ngi', 'ஙீ': 'ngee', 'ஙு': 'ngu', 'ஙூ': 'ngoo', 'ஙெ': 'nge', 'ஙே': 'nge', 'ஙை': 'ngai', 'ஙொ': 'ngo', 'ஙோ': 'ngo', 'ஙௌ': 'ngou',
  'ச்': 'ch', 'ச': 'sa', 'சா': 'saa', 'சி': 'si', 'சீ': 'see', 'சு': 'su', 'சூ': 'soo', 'செ': 'se', 'சே': 'se', 'சை': 'sai', 'சொ': 'so', 'சோ': 'so', 'சௌ': 'sou',
  'ஞ்': 'nj', 'ஞ': 'nja', 'ஞா': 'njaa', 'ஞி': 'nji', 'ஞீ': 'njee', 'ஞு': 'nju', 'ஞூ': 'njoo', 'ஞெ': 'nje', 'ஞே': 'nje', 'ஞை': 'njai', 'ஞொ': 'njo', 'ஞோ': 'njo', 'ஞௌ': 'njou',
  'ட்': 't', 'ட': 'ta', 'டா': 'taa', 'டி': 'ti', 'டீ': 'tee', 'டு': 'tu', 'டூ': 'too', 'டெ': 'te', 'டே': 'te', 'டை': 'tai', 'டொ': 'to', 'டோ': 'to', 'டௌ': 'tou',
  'ண்': 'n', 'ண': 'na', 'ணா': 'naa', 'ணி': 'ni', 'ணீ': 'nee', 'ணு': 'nu', 'ணூ': 'noo', 'ணெ': 'ne', 'ணே': 'ne', 'ணை': 'nai', 'ணொ': 'no', 'ணோ': 'no', 'ணௌ': 'nou',
  'த்': 'th', 'த': 'tha', 'தா': 'thaa', 'தி': 'thi', 'தீ': 'thee', 'து': 'thu', 'தூ': 'thoo', 'தெ': 'the', 'தே': 'the', 'தை': 'thai', 'தொ': 'tho', 'தோ': 'tho', 'தௌ': 'thou',
  'ந்': 'n', 'ந': 'na', 'நா': 'naa', 'நி': 'ni', 'நீ': 'nee', 'நு': 'nu', 'நூ': 'noo', 'நெ': 'ne', 'நே': 'ne', 'நை': 'nai', 'நொ': 'no', 'நோ': 'no', 'நௌ': 'nou',
  'ப்': 'p', 'ப': 'pa', 'பா': 'paa', 'பி': 'pi', 'பீ': 'pee', 'பு': 'pu', 'பூ': 'poo', 'பெ': 'pe', 'பே': 'pe', 'பை': 'pai', 'பொ': 'po', 'போ': 'po', 'பௌ': 'pou',
  'ம்': 'm', 'ம': 'ma', 'மா': 'maa', 'மி': 'mi', 'மீ': 'mee', 'மு': 'mu', 'மூ': 'moo', 'மெ': 'me', 'மே': 'me', 'மை': 'mai', 'மொ': 'mo', 'மோ': 'mo', 'மௌ': 'mou',
  'ய்': 'y', 'ய': 'ya', 'யா': 'yaa', 'யி': 'yi', 'யீ': 'yee', 'யு': 'yu', 'யூ': 'yoo', 'யெ': 'ye', 'யே': 'ye', 'யை': 'yai', 'யொ': 'yo', 'யோ': 'yo', 'யௌ': 'you',
  'ர்': 'r', 'ர': 'ra', 'ரா': 'raa', 'ரி': 'ri', 'ரீ': 'ree', 'ரு': 'ru', 'ரூ': 'roo', 'ரெ': 're', 'ரே': 're', 'ரை': 'rai', 'ரொ': 'ro', 'ரோ': 'ro', 'ரௌ': 'rou',
  'ல்': 'l', 'ல': 'la', 'லா': 'laa', 'லி': 'li', 'லீ': 'lee', 'லு': 'lu', 'லூ': 'loo', 'லெ': 'le', 'லே': 'le', 'லை': 'lai', 'லொ': 'lo', 'லோ': 'lo', 'லௌ': 'lou',
  'வ்': 'v', 'வ': 'va', 'வா': 'vaa', 'வி': 'vi', 'வீ': 'vee', 'வு': 'vu', 'வூ': 'voo', 'வெ': 've', 'வே': 've', 'வை': 'vai', 'வொ': 'vo', 'வோ': 'vo', 'வௌ': 'vou',
  'ழ்': 'zh', 'ழ': 'zha', 'ழா': 'zhaa', 'ழி': 'zhi', 'ழீ': 'zhee', 'ழு': 'zhu', 'ழூ': 'zhoo', 'ழெ': 'zhe', 'ழே': 'zhe', 'ழை': 'zhai', 'ழொ': 'zho', 'ழோ': 'zho', 'ழௌ': 'zhou',
  'ள்': 'l', 'ள': 'la', 'ளா': 'laa', 'ளி': 'li', 'ளீ': 'lee', 'ளு': 'lu', 'ளூ': 'loo', 'ளெ': 'le', 'ளே': 'le', 'ளை': 'lai', 'ளொ': 'lo', 'ளோ': 'lo', 'ளௌ': 'lou',
  'ற்': 'r', 'ற': 'ra', 'றா': 'raa', 'றி': 'ri', 'றீ': 'ree', 'று': 'ru', 'றூ': 'roo', 'றெ': 're', 'றே': 're', 'றை': 'rai', 'றொ': 'ro', 'றோ': 'ro', 'றௌ': 'rou',
  'ன்': 'n', 'ன': 'na', 'னா': 'naa', 'னி': 'ni', 'னீ': 'nee', 'னு': 'nu', 'னூ': 'noo', 'னெ': 'ne', 'னே': 'ne', 'னை': 'nai', 'னொ': 'no', 'னோ': 'no', 'னௌ': 'nou',
  'ஜ்': 'j', 'ஜ': 'ja', 'ஜா': 'jaa', 'ஜி': 'ji', 'ஜீ': 'jee', 'ஜு': 'ju', 'ஜூ': 'joo', 'ஜெ': 'je', 'ஜே': 'je', 'ஜை': 'jai', 'ஜொ': 'jo', 'ஜோ': 'jo', 'ஜௌ': 'jou',
  'ஷ்': 'sh', 'ஷ': 'sha', 'ஷா': 'shaa', 'ஷி': 'shi', 'ஷீ': 'shee', 'ஷு': 'shu', 'ஷூ': 'shoo', 'ஷெ': 'she', 'ஷே': 'she', 'ஷை': 'shai', 'ஷொ': 'sho', 'ஷோ': 'sho', 'ஷௌ': 'shou',
  'ஸ்': 's', 'ஸ': 'sa', 'ஸா': 'saa', 'ஸி': 'si', 'ஸீ': 'see', 'ஸு': 'su', 'ஸூ': 'soo', 'ஸெ': 'se', 'ஸே': 'se', 'ஸை': 'sai', 'ஸொ': 'so', 'ஸோ': 'so', 'ஸௌ': 'sou',
  'ஹ்': 'h', 'ஹ': 'ha', 'ஹா': 'haa', 'ஹி': 'hi', 'ஹீ': 'hee', 'ஹு': 'hu', 'ஹூ': 'hoo', 'ஹெ': 'he', 'ஹே': 'he', 'ஹை': 'hai', 'ஹொ': 'ho', 'ஹோ': 'ho', 'ஹௌ': 'hou',
  'க்ஷ்': 'ksh', 'க்ஷ': 'ksha', 'க்ஷா': 'kshaa', 'க்ஷி': 'kshi', 'க்ஷீ': 'kshee', 'க்ஷு': 'kshu', 'க்ஷூ': 'kshoo', 'க்ஷெ': 'kshe', 'க்ஷே': 'kshe', 'க்ஷை': 'kshai', 'க்ஷொ': 'ksho', 'க்ஷோ': 'ksho', 'க்ஷௌ': 'kshou',
  'ஸ்ரீ': 'sri'
};

export function transliterate(tamilStr: string): string {
  if (!tamilStr) return '';
  let result = tamilStr;
  
  const manualOverrides: Record<string, string> = {
    'இயேசுவே': 'yesuve',
    'இயேசு': 'yesu',
    'தேவன்': 'devan',
    'அன்பு': 'anbu',
    'கர்த்தர்': 'karthar',
    'கர்த்தாவே': 'karthave',
    'கிறிஸ்து': 'kristhu'
  };
  
  for (const [t, e] of Object.entries(manualOverrides)) {
    result = result.replace(new RegExp(t, 'g'), e);
  }

  const keys = Object.keys(tamilMap).sort((a, b) => b.length - a.length);
  const combined = new RegExp(keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
  result = result.replace(combined, (m) => tamilMap[m]);
  
  result = result.replace(/yesae/g, 'yese');
  result = result.replace(/iyaesu/g, 'yesu');
  result = result.replace(/iyaesauvae/g, 'yesuve');
  result = result.replace(/iyaesuvae/g, 'yesuve');
  result = result.replace(/yaesuvae/g, 'yesuve');

  return result;
}

export function normalizeToken(token: string): string {
  let normalized = token.toLowerCase();
  normalized = normalized.replace(/[^a-z0-9\u0B80-\u0BFF]/g, '');
  if (!normalized) return '';

  // Tamil script early return
  if (/[\u0B80-\u0BFF]/.test(normalized)) {
    return normalized;
  }

  // 1. Jesus Equivalence (yesu, yesuvin, yeasu, yesaiah, yesaiya, yesaiyea, etc.)
  if (/^(yes|yeas|iyes|eas|yas|es|yis|iyis|yash|yesh|yeash)[uayieo]*(v|y|a|e|i|y)*(n|h|a|e|i|y|ea)*$/.test(normalized)) {
    return 'yesu';
  }

  // 2. Lord Equivalence (karthar, kartharu, kartharin, karthavin, etc.)
  if (/^karth(a|e|i|o|u|y|v)*(r|n|u|m)?(i|a|e|o|u|y)*(n)?$/.test(normalized)) {
    return 'karthar';
  }

  // 3. Day / Good Equivalence (naala, nala, nalaa)
  if (/^na+la+$/.test(normalized)) {
    return 'nala';
  }

  // 4. Vowel Normalizations
  normalized = normalized.replace(/ea/g, 'e');
  normalized = normalized.replace(/ee/g, 'i');
  normalized = normalized.replace(/oo/g, 'u');
  normalized = normalized.replace(/uu/g, 'u');
  normalized = normalized.replace(/aa/g, 'a');
  normalized = normalized.replace(/ae/g, 'e');
  normalized = normalized.replace(/ai/g, 'e');
  normalized = normalized.replace(/ay/g, 'e');
  normalized = normalized.replace(/ey/g, 'e');

  // 5. Consonant Sound-alikes
  normalized = normalized.replace(/sh/g, 's');
  normalized = normalized.replace(/zh/g, 'l');
  normalized = normalized.replace(/lh/g, 'l');
  normalized = normalized.replace(/ph/g, 'p');
  normalized = normalized.replace(/kh/g, 'k');
  normalized = normalized.replace(/gh/g, 'k');
  normalized = normalized.replace(/th/g, 't');
  normalized = normalized.replace(/h/g, 'k'); // map h -> k for sound-alikes (alahu -> alaku)
  normalized = normalized.replace(/d/g, 't');
  normalized = normalized.replace(/b/g, 'p');
  normalized = normalized.replace(/g/g, 'k');
  normalized = normalized.replace(/j/g, 's');
  normalized = normalized.replace(/w/g, 'v');

  // 6. Collapse duplicate letters
  normalized = normalized.replace(/([a-z])\1+/g, '$1');

  // 7. Strip final vowels for robust suffix tolerance (only if length > 2)
  if (normalized.length > 2) {
    normalized = normalized.replace(/[aeiou]+$/g, '');
  }

  return normalized;
}

export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .split(/\s+/)
    .map(normalizeToken)
    .filter(Boolean)
    .join(' ');
}

// Alias for migration backwards compatibility
export function normalizeTanglishQuery(query: string): string {
  return normalizeText(query);
}

// Build a searchable keyword blob for a song. It contains:
//  - the original (Tamil) text, for direct Tamil substring search
//  - the canonical transliteration skeleton (vowels collapsed, sound-alikes
//    merged via normalizeToken) of both title and lyrics. Because every
//    romanization variant (umakkaga / umakaaga / umakaga) maps to the same
//    skeleton, all of them match.
export function buildSearchKeywords(title: string, lyrics: string): string {
  const parts: string[] = [];
  const add = (text: string) => {
    if (!text) return;
    parts.push(text);
    parts.push(normalizeText(transliterate(text)));
  };
  add(title ?? '');
  add(lyrics ?? '');
  return parts.join(' ');
}

export function smartSplitSlides(content: string): string[] {
  if (!content) return [];
  const stanzas = content.split(/\n\s*\n+/).map(s => s.trim()).filter(Boolean);
  const slides: string[] = [];
  
  for (const stanza of stanzas) {
    const lines = stanza.split('\n').map(l => l.trim()).filter(Boolean);
    
    if (lines.length <= 4) {
      slides.push(lines.join('\n'));
    } else if (lines.length === 5) {
      slides.push(lines.slice(0, 3).join('\n'));
      slides.push(lines.slice(3, 5).join('\n'));
    } else if (lines.length === 6) {
      slides.push(lines.slice(0, 3).join('\n'));
      slides.push(lines.slice(3, 6).join('\n'));
    } else {
      let currentSlide: string[] = [];
      for (let i = 0; i < lines.length; i++) {
        currentSlide.push(lines[i]);
        if (currentSlide.length === 4 || i === lines.length - 1) {
          slides.push(currentSlide.join('\n'));
          currentSlide = [];
        }
      }
    }
  }
  return slides;
}

export async function getSongsByIds(ids: number[]) {
    const data = { ids };
    if (!data.ids || data.ids.length === 0) return [];
    const db = await getTamilSongsDb();
    const placeholders = data.ids.map(() => '?').join(',');
    const rawRows = await query<any>(db, `SELECT * FROM songs WHERE id IN (${placeholders})`, data.ids);
    return rawRows.map(r => ({
      id: r.id,
      title: r.title || '',
      content: r.content || '',
      artist: r.artist || '',
      album: r.album || '',
      scale: r.scale || '',
      slides: smartSplitSlides(r.content || '')
    }));
}

export async function getAllSongs() {
    const db = await getTamilSongsDb();
    const rawRows = await query<any>(db, `SELECT * FROM songs`);
    return rawRows.map(r => ({
      id: r.id, title: r.title || '', content: r.content || '',
      artist: r.artist || '', album: r.album || '', scale: r.scale || ''
    }));
}

function levenshtein(a: string, b: string): number {
  const tmp: number[][] = [];
  let i: number, j: number;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  for (i = 0; i <= a.length; i++) tmp[i] = [i];
  for (j = 0; j <= b.length; j++) tmp[0][j] = j;
  for (i = 1; i <= a.length; i++) {
    for (j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[a.length][b.length];
}

function getTrigrams(str: string): string[] {
  const s = '  ' + str + '  ';
  const trigrams: string[] = [];
  for (let i = 0; i < s.length - 2; i++) {
    trigrams.push(s.slice(i, i + 3));
  }
  return trigrams;
}

function trigramSimilarity(a: string, b: string): number {
  const tr1 = getTrigrams(a);
  const tr2 = getTrigrams(b);
  const set1 = new Set(tr1);
  const set2 = new Set(tr2);
  let intersection = 0;
  for (const t of set1) {
    if (set2.has(t)) intersection++;
  }
  const union = set1.size + set2.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// Redesigned FTS + JS similarity scorer
export async function performSongSearch(query: string) {
  const db = await getTamilSongsDb();
  const trimmed = query.trim();
  
  if (!trimmed) return [];

  // Unified Tamil + Tanglish + fuzzy search (see buildSearchKeywords)
  // Build FTS match tokens: Tamil kept verbatim, Latin normalized to the same
  // canonical skeleton used when indexing. Trigram tokenizer makes this a
  // substring match (so "vaal" inside "vazhkiren" works).
  const matchTokens: string[] = [];
  for (const t of trimmed.split(/\s+/).filter(Boolean)) {
    if (/[\u0B80-\u0BFF]/.test(t)) {
      matchTokens.push(t.replace(/["\\]/g, ''));
    } else {
      const sk = normalizeToken(t);
      if (sk) matchTokens.push(sk.replace(/["\\]/g, ''));
    }
  }
  if (matchTokens.length === 0) return [];

  // OR semantics: a song matching ANY query token is a candidate, so a
  // single fuzzy/misspelled token can't exclude the right song. Ranking by
  // token coverage (with fuzzy tolerance) then brings the best song to top.
  const matchExpr = matchTokens.join(' OR ');

  const rawRows = await query<any>(db, `
    SELECT s.id, s.title, s.content, s.artist, s.album, s.scale, s.search_keywords
    FROM songs_fts f
    JOIN songs s ON f.rowid = s.id
    WHERE songs_fts MATCH ?
    ORDER BY bm25(songs_fts) ASC
    LIMIT 200
  `, [matchExpr]);

  const queryLower = trimmed.toLowerCase();
  const results: any[] = [];

  for (const song of rawRows) {
    const titleLower = (song.title || '').toLowerCase();
    const kw = (song.search_keywords || '').toLowerCase();
    const kwTokens = kw.split(/\s+/);

    let covered = 0;
    for (const q of matchTokens) {
      const ql = q.toLowerCase();
      if (!ql) continue;
      let matched = false;
      if (kw.includes(ql)) {
        matched = true;
      } else {
        for (const kt of kwTokens) {
          if (!kt) continue;
          if (kt.includes(ql) || ql.includes(kt) || levenshtein(ql, kt) <= 2) {
            matched = true;
            break;
          }
        }
      }
      if (matched) covered++;
    }

    // Priority: exact title > title contains query > token coverage
    let score = 0;
    if (titleLower === queryLower) score += 1000;
    if (titleLower.includes(queryLower)) score += 300;
    score += covered * 100;
    score += Math.round((covered / matchTokens.length) * 200);

    results.push({
      id: song.id,
      title: song.title || '',
      content: song.content || '',
      artist: song.artist || '',
      album: song.album || '',
      scale: song.scale || '',
      score,
    });
  }

  results.sort((a, b) => b.score - a.score);

  return results.slice(0, 50).map(r => ({
    id: r.id,
    title: r.title,
    content: r.content,
    artist: r.artist,
    album: r.album,
    scale: r.scale,
    slides: smartSplitSlides(r.content),
  }));
}

