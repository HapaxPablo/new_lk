import {
  SITEMAP_BRANDS_PAGE_SIZE,
  SITEMAP_FETCH_RETRIES,
  SITEMAP_FETCH_TIMEOUT_MS,
  SITEMAP_MAX_PAGES,
  SITEMAP_NOMENCLATURES_PAGE_SIZE,
} from './config'
import { buildSitemapApiUrl } from './urls'

export interface PaginatedApiResponse<T> {
  results: T[]
  count?: number
  next: string | null
  previous?: string | null
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableFetchError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  const message = error.message.toLowerCase()
  const cause = (error as { cause?: { code?: string } }).cause

  return (
    message.includes('fetch failed') ||
    message.includes('aborted') ||
    message.includes('timeout') ||
    cause?.code === 'UND_ERR_SOCKET' ||
    cause?.code === 'ECONNRESET'
  )
}

async function fetchPaginatedPage<T>(
  url: string,
  attempt = 1
): Promise<PaginatedApiResponse<T>> {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(SITEMAP_FETCH_TIMEOUT_MS),
    })

    if (!res.ok) {
      console.warn(
        `[sitemap] ${res.status} ${res.statusText} for ${url} (attempt ${attempt})`
      )
      return { results: [], next: null }
    }

    const data = await res.json()

    if (!data || !Array.isArray(data.results)) {
      console.warn(`[sitemap] Invalid JSON from ${url}`)
      return { results: [], next: null }
    }

    return data as PaginatedApiResponse<T>
  } catch (error) {
    if (attempt < SITEMAP_FETCH_RETRIES && isRetryableFetchError(error)) {
      const delayMs = 500 * attempt
      console.warn(
        `[sitemap] Retry ${attempt + 1}/${SITEMAP_FETCH_RETRIES} in ${delayMs}ms: ${url}`
      )
      await sleep(delayMs)
      return fetchPaginatedPage<T>(url, attempt + 1)
    }

    console.error(`[sitemap] Fetch error for ${url}:`, error)
    return { results: [], next: null }
  }
}

/**
 * Номенклатуры: пагинация по page (как в каталоге).
 */
export async function fetchAllNomenclaturesForSitemap<
  T extends { id: string },
>(): Promise<T[]> {
  const all: T[] = []
  let page = 1
  const pageSize = SITEMAP_NOMENCLATURES_PAGE_SIZE

  while (page <= SITEMAP_MAX_PAGES) {
    const url = buildSitemapApiUrl('api/nomenclatures/', {
      limit: String(pageSize),
      page: String(page),
    })

    const data = await fetchPaginatedPage<T>(url)
    all.push(...data.results)

    if (!data.next || data.results.length < pageSize) {
      break
    }

    page += 1
  }

  return all
}

/**
 * Бренды для публичного каталога: api/brands/assigned (как /brands).
 */
export async function fetchAllBrandsForSitemap<
  T extends { slug: string },
>(): Promise<T[]> {
  const all: T[] = []
  let offset = 0
  const pageSize = SITEMAP_BRANDS_PAGE_SIZE

  for (let page = 0; page < SITEMAP_MAX_PAGES; page += 1) {
    const url = buildSitemapApiUrl('api/brands/assigned', {
      limit: String(pageSize),
      offset: String(offset),
    })

    const data = await fetchPaginatedPage<T>(url)
    all.push(...data.results)

    if (!data.next || data.results.length < pageSize) {
      break
    }

    offset += pageSize
  }

  return all
}
