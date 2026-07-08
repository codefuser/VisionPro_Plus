import { createClient, type Client } from '@libsql/client';
import path from 'path';

type DbKind = 'en' | 'ta' | 'songs';

const LOCAL_URLS: Record<DbKind, string> = {
  en: 'file:' + path.resolve(process.cwd(), 'data', 'english_bible.db'),
  ta: 'file:' + path.resolve(process.cwd(), 'data', 'tamil_bible.db'),
  songs: 'file:' + path.resolve(process.cwd(), 'data', 'tamilsongs.sqlite'),
};

const REMOTE_ENV: Record<DbKind, string> = {
  en: 'TURSO_URL_EN',
  ta: 'TURSO_URL_TA',
  songs: 'TURSO_URL_SONGS',
};

function resolveUrl(kind: DbKind): string {
  return process.env[REMOTE_ENV[kind]] || LOCAL_URLS[kind];
}

const clients: Partial<Record<DbKind, Client>> = {};

function getClient(kind: DbKind): Client {
  if (!clients[kind]) {
    const url = resolveUrl(kind);
    const isLocal = url.startsWith('file:');
    clients[kind] = createClient({
      url,
      authToken: isLocal ? undefined : process.env.TURSO_AUTH_TOKEN,
    });
  }
  return clients[kind]!;
}

export function getEnglishBibleDb(): Promise<Client> {
  return Promise.resolve(getClient('en'));
}

export function getTamilBibleDb(): Promise<Client> {
  return Promise.resolve(getClient('ta'));
}

export function getTamilSongsDb(): Promise<Client> {
  return Promise.resolve(getClient('songs'));
}

export function isUsingRemote(): boolean {
  return Boolean(
    process.env.TURSO_URL_EN ||
    process.env.TURSO_URL_TA ||
    process.env.TURSO_URL_SONGS,
  );
}

export async function query<T = Record<string, any>>(
  db: Client,
  sql: string,
  args: unknown[] = [],
): Promise<T[]> {
  const res = await db.execute({ sql, args });
  return res.rows as T[];
}

export async function queryOne<T = Record<string, any>>(
  db: Client,
  sql: string,
  args: unknown[] = [],
): Promise<T | undefined> {
  const res = await db.execute({ sql, args });
  return (res.rows[0] as T) ?? undefined;
}

export async function run(
  db: Client,
  sql: string,
  args: unknown[] = [],
): Promise<void> {
  await db.execute({ sql, args });
}
