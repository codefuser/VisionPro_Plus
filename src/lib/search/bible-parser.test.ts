import { parseBibleReference, getAliasCount } from './bible-parser';

const testCases = [
  { input: "Psalm 23", expected: { book: 19, chapter: 23 } },
  { input: "Psalm 23:1", expected: { book: 19, chapter: 23, verse: 1 } },
  { input: "Psa 23", expected: { book: 19, chapter: 23 } },
  { input: "Ps 23", expected: { book: 19, chapter: 23 } },
  { input: "Sang 23", expected: { book: 19, chapter: 23 } },
  { input: "Sangeetham 23", expected: { book: 19, chapter: 23 } },
  { input: "சங்கீதம் 23", expected: { book: 19, chapter: 23 } },
  { input: "Gen 1:1", expected: { book: 1, chapter: 1, verse: 1 } },
  { input: "Genesis 1:1", expected: { book: 1, chapter: 1, verse: 1 } },
  { input: "Aathi 1:1", expected: { book: 1, chapter: 1, verse: 1 } },
  { input: "ஆதி 1:1", expected: { book: 1, chapter: 1, verse: 1 } },
  // Edge cases
  { input: "1 John 3:16", expected: { book: 62, chapter: 3, verse: 16 } },
  { input: "1John 3:16", expected: { book: 62, chapter: 3, verse: 16 } },
  { input: "1 யோவான் 3:16", expected: { book: 62, chapter: 3, verse: 16 } }
];

let failed = 0;
console.log(`\n--- Running Bible Parser Tests (Total Aliases: ${getAliasCount()}) ---`);

// Warmup
parseBibleReference("Ps 1:1");

for (const t of testCases) {
  const start = performance.now();
  const res = parseBibleReference(t.input);
  const end = performance.now();
  
  const time = (end - start).toFixed(4);
  const passed = JSON.stringify(res) === JSON.stringify(t.expected);
  
  if (passed) {
    console.log(`✅ [${time}ms] '${t.input}' -> ${JSON.stringify(res)}`);
  } else {
    console.error(`❌ [${time}ms] '${t.input}' FAILED.`);
    console.error(`   Expected: ${JSON.stringify(t.expected)}`);
    console.error(`   Got:      ${JSON.stringify(res)}`);
    failed++;
  }
}

if (failed === 0) {
  console.log("\nAll tests passed successfully.");
} else {
  console.log(`\n${failed} tests failed.`);
}
