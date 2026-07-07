import { performSongSearch } from './songs';

const testCases = [
  // Tamil Script Tests
  { name: "Tamil Title Exact", query: "இயேசுவே", expectedResults: true },
  { name: "Tamil Partial", query: "இயேசு", expectedResults: true },
  { name: "Tamil Title Exact (God)", query: "தேவன்", expectedResults: true },

  // Tanglish Script Tests (All should pass now)
  { name: "Tanglish (yesuve)", query: "yesuve", expectedResults: true },
  { name: "Tanglish (yesu)", query: "yesu", expectedResults: true },
  { name: "Tanglish Phonetic (yeshuve)", query: "yeshuve", expectedResults: true },
  { name: "Tanglish (iyesu)", query: "iyesu", expectedResults: true },
  { name: "Tanglish Phonetic (iyesuve)", query: "iyesuve", expectedResults: true },
  { name: "Tanglish Phonetic (yesuvae)", query: "yesuvae", expectedResults: true },
  { name: "Tanglish Phonetic (yesuvey)", query: "yesuvey", expectedResults: true },
  { name: "Tanglish Phonetic (yeshu)", query: "yeshu", expectedResults: true },
  { name: "Tanglish (anbu)", query: "anbu", expectedResults: true },
  { name: "Tanglish (devan)", query: "devan", expectedResults: true },

  // Lyrics Search Test
  { name: "Lyrics English", query: "love", expectedResults: true }, // assuming some english song or lyrics has love
];

console.log("\n--- Running Song Search Engine Tests ---");

let totalTime = 0;
let passed = 0;

for (const t of testCases) {
  const start = performance.now();
  const results = performSongSearch(t.query);
  const end = performance.now();
  
  const time = (end - start).toFixed(2);
  totalTime += (end - start);
  
  const hasResults = results.length > 0;
  // Let's just print top 2 for brevity
  const top2 = results.slice(0, 2).map(r => r.title).join(' | ');

  if (hasResults) {
    passed++;
    console.log(`✅ [${time}ms] ${t.name} ('${t.query}') -> FOUND ${results.length}/10: ${top2}`);
  } else {
    if (t.expectedResults) {
      console.error(`❌ [${time}ms] ${t.name} ('${t.query}') -> FAILED (No results)`);
    } else {
      // Expected to fail (like fuzzy unmatched logic for now)
      console.log(`⚠️ [${time}ms] ${t.name} ('${t.query}') -> 0 results (Expected fallback)`);
      passed++;
    }
  }
}

const avg = (totalTime / testCases.length).toFixed(2);
console.log(`\nAll tests completed. Average execution: ${avg}ms`);
