import { createServerFn } from '@tanstack/react-start';

export const searchSongsFn = createServerFn({ method: 'GET' })
  .validator((d: { query: string }) => d)
  .handler(async ({ data }) => {
    const { performSongSearch } = await import('@/server/songs');
    return performSongSearch(data.query);
  });

export const getSongsByIdsFn = createServerFn({ method: 'GET' })
  .validator((d: { ids: number[] }) => d)
  .handler(async ({ data }) => {
    const { getSongsByIds } = await import('@/server/songs');
    return getSongsByIds(data.ids);
  });

export const getAllSongsFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const { getAllSongs } = await import('@/server/songs');
    return getAllSongs();
  });
