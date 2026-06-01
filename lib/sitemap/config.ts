/** Размер страницы при обходе API 1С (лимит на стороне API может быть меньше). */
export const SITEMAP_PAGE_SIZE = 500

/**
 * Кэш ответов sitemap (секунды).
 * В app/sitemap.ts для export const revalidate нужен тот же литерал (3600).
 */
export const SITEMAP_REVALIDATE_SECONDS = 3600

/** Защита от бесконечного цикла пагинации. */
export const SITEMAP_MAX_PAGES = 500
