import { createServerFn } from '@tanstack/react-start';

export const searchBibleFn = createServerFn({ method: 'GET' })
  .validator((d: { query: string; lang: 'en' | 'ta' | 'both'; limit?: number }) => d)
  .handler(async ({ data }) => {
    const { performBibleSearch } = await import('@/server/bible');
    return performBibleSearch(data.query, data.lang, data.limit || 80);
  });

export const getBibleChapterFn = createServerFn({ method: 'GET' })
  .validator((d: { book: number; chapter: number }) => d)
  .handler(async ({ data }) => {
    const { getBibleChapter } = await import('@/server/bible');
    return getBibleChapter(data.book, data.chapter);
  });

export const getAllBibleFn = createServerFn({ method: 'GET' })
  .validator((d: { lang: 'en' | 'ta' }) => d)
  .handler(async ({ data }) => {
    const { getAllBible } = await import('@/server/bible');
    return getAllBible(data.lang);
  });
