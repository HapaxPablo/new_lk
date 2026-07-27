/**
 * Базовый URL сайта для sitemap (без завершающего слэша).
 */
export function getSitemapSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'https://krasrm.com'

  return raw.replace(/\/$/, '')
}

/**
 * Базовый URL API 1С — тот же, что в страницах: new URL('api/...', API_1C_URL).
 */
export function getSitemapApiBaseUrl(): string {
  const raw =
    process.env.API_1C_URL ||
    process.env.NEXT_PUBLIC_API_1C_URL ||
    'https://api1.krasrm.com/'

  return raw.endsWith('/') ? raw : `${raw}/`
}

/** Собирает URL к API так же, как app/(main)/nomenclatures/page.tsx. */
export function buildSitemapApiUrl(
  apiPath: string,
  searchParams?: Record<string, string>
): string {
  const normalized = apiPath.startsWith('/') ? apiPath.slice(1) : apiPath
  const url = new URL(normalized, getSitemapApiBaseUrl())

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value)
    }
  }

  return url.toString()
}

export function absoluteSitePath(pathname: string): string {
  const site = getSitemapSiteUrl()
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${site}${path}`
}
