const { execSync } = require('child_process');
// Transpile TS to JS and test
execSync('npx tsc src/lib/search/bible-parser.ts --outDir ./dist --esModuleInterop');
execSync('npx tsc src/lib/bible/books.ts --outDir ./dist --esModuleInterop');

const { searchBibleBook } = require('./dist/search/bible-parser.js');

const queries = ['veli', 'veli paduthal', 'velipaduthal', 'rev', '1 nala', 'nala'];

console.log("=== Bible Book Search Test ===");
queries.forEach(q => {
  const res = searchBibleBook(q);
  console.log(`Query: '${q}' -> `, res);
});
