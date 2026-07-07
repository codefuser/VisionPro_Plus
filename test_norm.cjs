function normalizeTanglishQuery(query) {
  let normalized = query.toLowerCase();
  
  // 1. Consonant normalizations
  normalized = normalized.replace(/sh/g, 's');
  normalized = normalized.replace(/d/g, 't'); // e.g. pidavae -> pitavae
  normalized = normalized.replace(/b/g, 'p'); // e.g. anbane -> anpane
  normalized = normalized.replace(/g/g, 'k');
  normalized = normalized.replace(/j/g, 's'); // e.g. jeevan -> seevan
  normalized = normalized.replace(/w/g, 'v');
  normalized = normalized.replace(/zh/g, 'l');
  normalized = normalized.replace(/th/g, 't');
  
  // 2. Vowel and Suffix normalizations
  normalized = normalized.replace(/iyesu/g, 'yesu');
  normalized = normalized.replace(/yeshu/g, 'yesu');
  
  // Normalize double vowels
  normalized = normalized.replace(/aa/g, 'a');
  normalized = normalized.replace(/ee/g, 'i');
  normalized = normalized.replace(/oo/g, 'u');
  
  // Normalize endings
  normalized = normalized.replace(/vae/g, 've');
  normalized = normalized.replace(/vey/g, 've');
  normalized = normalized.replace(/va/g, 've'); // pidava -> pidave
  normalized = normalized.replace(/nae/g, 'ne');
  normalized = normalized.replace(/ney/g, 'ne');
  normalized = normalized.replace(/na/g, 'ne');
  
  // Collapse duplicate letters
  normalized = normalized.replace(/([a-z])\1+/g, '$1');
  
  return normalized;
}

const queries = [
  "ummai pola vaalanumea yeasaiyea",
  "karthavin janamea kaithalamudanea",
  "enna alahu en yeasuvin kangal",
  "yesaiah",
  "yesaiya",
  "yeasu"
];

queries.forEach(q => {
  console.log(`\nOriginal: ${q}`);
  console.log(`Norm: ${normalizeTanglishQuery(q)}`);
  
  // Words:
  const words = normalizeTanglishQuery(q).replace(/"/g, '').replace(/'/g, '').split(/\s+/).filter(Boolean);
  console.log(`FTS: ${words.map(w => `"${w}" *`).join(' AND ')}`);
});
