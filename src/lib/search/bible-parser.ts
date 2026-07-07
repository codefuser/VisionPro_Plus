import { BIBLE_BOOKS } from '../bible/books';

export interface ParsedReference {
  book: number;
  chapter: number;
  verse?: number;
}

export function getAliasCount(): number {
  let count = 0;
  for (const b of BIBLE_BOOKS) count += b.aliases.length;
  return count;
}

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

function transliterate(tamilStr: string): string {
  if (!tamilStr) return '';
  let result = tamilStr;
  const keys = Object.keys(tamilMap).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    result = result.replace(new RegExp(k, 'g'), tamilMap[k]);
  }
  return result;
}

function collapseVowels(str: string): string {
  let n = str.toLowerCase();
  n = n.replace(/ea/g, 'e');
  n = n.replace(/ae/g, 'e');
  n = n.replace(/aa/g, 'a');
  n = n.replace(/ee/g, 'i');
  n = n.replace(/oo/g, 'u');
  n = n.replace(/uu/g, 'u');
  n = n.replace(/([a-z])\1+/g, '$1');
  return n;
}

function normalizeBibleQuery(q: string): string {
  let n = q.trim().toLowerCase();
  if (/[\u0B80-\u0BFF]/.test(n)) {
    n = transliterate(n);
  }
  n = collapseVowels(n);
  n = n.replace(/[^a-z0-9]/g, '');
  return n;
}

export function searchBibleBook(query: string): { bookId: number; score: number } | null {
  const normQuery = normalizeBibleQuery(query);
  if (!normQuery) return null;

  let bestMatch: { bookId: number; score: number; priority: number } | null = null;

  for (const book of BIBLE_BOOKS) {
    const names = [
      book.name,
      book.nameTa,
      book.code,
      ...book.aliases
    ];

    for (const rawAlias of names) {
      const alias = rawAlias.toLowerCase();
      
      // Exact Match (Priority 1)
      if (alias === query.trim().toLowerCase()) {
        return { bookId: book.index + 1, score: 1.0 };
      }

      // Transliterated / Normalized Exact Match (Priority 3)
      const normAlias = normalizeBibleQuery(rawAlias);
      if (normAlias === normQuery) {
        return { bookId: book.index + 1, score: 0.95 };
      }

      // Try match without leading numbers (Chronicles, Samuel, Kings, John etc.)
      const aliasNoNum = alias.replace(/^\d+\s*/, '');
      const normAliasNoNum = normAlias.replace(/^\d+/, '');
      if (aliasNoNum === query.trim().toLowerCase()) {
        return { bookId: book.index + 1, score: 0.92 };
      }
      if (normAliasNoNum === normQuery) {
        return { bookId: book.index + 1, score: 0.90 };
      }

      // Prefix matches (Priority 2)
      if (alias.startsWith(query.trim().toLowerCase())) {
        const score = 0.85;
        if (!bestMatch || score > bestMatch.score || (score === bestMatch.score && bestMatch.priority > 2)) {
          bestMatch = { bookId: book.index + 1, score, priority: 2 };
        }
      }

      // Normalized Prefix matches (Priority 3/4)
      if (normAlias.startsWith(normQuery)) {
        const score = 0.8 + (normQuery.length / normAlias.length) * 0.09;
        if (!bestMatch || score > bestMatch.score || (score === bestMatch.score && bestMatch.priority > 4)) {
          bestMatch = { bookId: book.index + 1, score, priority: 4 };
        }
      }

      // Prefix match without leading number
      if (aliasNoNum.startsWith(query.trim().toLowerCase())) {
        const score = 0.82;
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { bookId: book.index + 1, score, priority: 4 };
        }
      }
      if (normAliasNoNum.startsWith(normQuery)) {
        const score = 0.78 + (normQuery.length / normAliasNoNum.length) * 0.09;
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { bookId: book.index + 1, score, priority: 4 };
        }
      }
    }
  }

  return bestMatch ? { bookId: bestMatch.bookId, score: bestMatch.score } : null;
}

export function parseBibleReference(query: string): ParsedReference | null {
  const normalizedQuery = query.trim().toLowerCase();
  
  // Match: (BookName with optional leading number) (Chapter) [:(Verse)]
  const regex = /^(\d?\s*[a-z\u0B80-\u0BFF]+)\s+(\d+)(?:\s*[:.\s]\s*(\d+))?$/;
  const match = normalizedQuery.match(regex);
  
  if (!match) return null;
  
  const rawBook = match[1];
  const chapterStr = match[2];
  const verseStr = match[3];
  
  const bookMatch = searchBibleBook(rawBook);
  if (!bookMatch) return null;
  
  const parsed: ParsedReference = {
    book: bookMatch.bookId,
    chapter: parseInt(chapterStr, 10)
  };
  
  if (verseStr) {
    parsed.verse = parseInt(verseStr, 10);
  }
  
  return parsed;
}
