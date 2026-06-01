/** Бренды: размер страницы при обходе API. */
export const SITEMAP_BRANDS_PAGE_SIZE = 100

export const SITEMAP_TENANTS_PAGE_SIZE = 100

/**
 * Номенклатуры: меньший limit — большие ответы рвут соединение (UND_ERR_SOCKET).
 */
export const SITEMAP_NOMENCLATURES_PAGE_SIZE = 100

/** Повторы запроса при обрыве соединения. */
export const SITEMAP_FETCH_RETRIES = 3

/** Таймаут одного запроса к API (мс). */
export const SITEMAP_FETCH_TIMEOUT_MS = 60_000

/** Защита от бесконечного цикла пагинации. */
export const SITEMAP_MAX_PAGES = 800
