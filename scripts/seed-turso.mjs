// One-time migration: copy the local sqlite datasets into Turso.
// Usage:
//   TURSO_AUTH_TOKEN=... \
//   TURSO_URL_SONGS=libsql://<db>.turso.io \
//   TURSO_URL_TA=libsql://<db>.turso.io \
//   TURSO_URL_EN=libsql://<db>.turso.io \
//   node scripts/seed-turso.mjs
import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';
import path from 'path';

const AUTH = process.env.TURSO_AUTH_TOKEN;
if (!AUTH) {
  console.error('TURSO_AUTH_TOKEN is required');
  process.exit(1);
}

const datasets = [
  { name: 'songs', file: 'tamilsongs.sqlite', urlEnv: 'TURSO_URL_SONGS' },
  { name: 'tamil_bible', file: 'tamil_bible.db', urlEnv: 'TURSO_URL_TA' },
  { name: 'english_bible', file: 'english_bible.db', urlEnv: 'TURSO_URL_EN' },
];

async function migrate(ds) {
  const url = process.env[ds.urlEnv];
  if (!url) {
    console.warn(`Skip ${ds.name}: ${ds.urlEnv} not set`);
    return;
  }

  const local = new Database(path.resolve(process.cwd(), 'data', ds.file), { readonly: true });
  const remote = createClient({ url, authToken: AUTH });
  console.log(`\nMigrating ${ds.name} -> ${url}`);

  const allTables = local
    .prepare(`SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`)
    .all();
  const virtual = allTables.filter((t) => t.sql.startsWith('CREATE VIRTUAL'));
  const base = allTables.filter((t) => !t.sql.startsWith('CREATE VIRTUAL'));

  // Drop everything first (virtual tables before their base tables).
  for (const t of [...virtual, ...base]) {
    await remote.execute(`DROP TABLE IF EXISTS "${t.name}"`);
  }

  // Recreate base tables and copy rows.
  for (const t of base) {
    await remote.execute(t.sql);
    const cols = local
      .prepare(`PRAGMA table_info("${t.name}")`)
      .all()
      .map((c) => c.name);
    const rows = local.prepare(`SELECT * FROM "${t.name}"`).all();
    const placeholders = cols.map(() => '?').join(',');
    const insertSql = `INSERT INTO "${t.name}" (${cols
      .map((c) => `"${c}"`)
      .join(',')}) VALUES (${placeholders})`;
    for (const row of rows) {
      await remote.execute({ sql: insertSql, args: cols.map((c) => row[c]) });
    }
    console.log(`  ${t.name}: ${rows.length} rows`);
  }

  // Recreate FTS virtual tables and rebuild their index from the base tables.
  for (const t of virtual) {
    await remote.execute(t.sql);
    await remote.execute(`INSERT INTO "${t.name}"("${t.name}") VALUES('rebuild')`);
    console.log(`  ${t.name}: rebuilt`);
  }

  local.close();
  console.log(`Done ${ds.name}`);
}

for (const ds of datasets) {
  await migrate(ds);
}
console.log('\nAll datasets migrated.');
