import {
  SITEMAP_BRANDS_PAGE_SIZE,
  SITEMAP_FETCH_RETRIES,
  SITEMAP_FETCH_TIMEOUT_MS,
  SITEMAP_MAX_PAGES,
  SITEMAP_NOMENCLATURES_PAGE_SIZE,
  SITEMAP_TENANTS_PAGE_SIZE,
} from './config'
import { buildSitemapApiUrl, getSitemapApiBaseUrl } from './urls'

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

function shouldFetchNextPage(
  loaded: number,
  lastBatchSize: number,
  totalCount?: number
): boolean {
  if (lastBatchSize === 0) {
    return false
  }

  if (totalCount !== undefined) {
    return loaded < totalCount
  }

  return lastBatchSize > 0
}

/**
 * Номенклатуры: пагинация по page (как в каталоге).
 * Ориентируемся на count — API может отдавать меньше limit за запрос.
 */
export async function fetchAllNomenclaturesForSitemap<
  T extends { id: string },
>(): Promise<T[]> {
  const all: T[] = []
  let page = 1
  const pageSize = SITEMAP_NOMENCLATURES_PAGE_SIZE
  let totalCount: number | undefined

  while (page <= SITEMAP_MAX_PAGES) {
    const url = buildSitemapApiUrl('api/nomenclatures/', {
      limit: String(pageSize),
      page: String(page),
    })

    const data = await fetchPaginatedPage<T>(url)
    if (data.results.length === 0) {
      break
    }

    all.push(...data.results)
    if (data.count !== undefined) {
      totalCount = data.count
    }

    if (!shouldFetchNextPage(all.length, data.results.length, totalCount)) {
      break
    }

    page += 1
  }

  return all
}

/**
 * Бренды: api/brands/assigned (как /brands и useBrands — hasMore по count).
 */
export async function fetchAllBrandsForSitemap<
  T extends { slug: string },
>(): Promise<T[]> {
  const all: T[] = []
  let offset = 0
  const pageSize = SITEMAP_BRANDS_PAGE_SIZE
  let totalCount: number | undefined

  for (let page = 0; page < SITEMAP_MAX_PAGES; page += 1) {
    const url = buildSitemapApiUrl('api/brands/assigned', {
      limit: String(pageSize),
      offset: String(offset),
    })

    const data = await fetchPaginatedPage<T>(url)
    if (data.results.length === 0) {
      break
    }

    all.push(...data.results)
    if (data.count !== undefined) {
      totalCount = data.count
    }

    if (!shouldFetchNextPage(all.length, data.results.length, totalCount)) {
      break
    }

    offset += data.results.length
  }

  if (totalCount !== undefined && all.length < totalCount) {
    console.warn(
      `[sitemap] Brands incomplete: loaded ${all.length} of ${totalCount}`
    )
  }

  return all
}

/**
 * Тенанты: api/tenants/grouped (как /tenants и useTenants — hasMore по count).
 */
export async function fetchAllTenantsForSitemap<
  T extends { tenantId: string },
>(): Promise<T[]> {
  const all: T[] = []
  let offset = 0
  const pageSize = SITEMAP_TENANTS_PAGE_SIZE
  let totalCount: number | undefined

  for (let page = 0; page < SITEMAP_MAX_PAGES; page += 1) {
    const url = buildSitemapApiUrl('api/tenants/grouped', {
      limit: String(pageSize),
      offset: String(offset),
    })

    const data = await fetchPaginatedPage<T>(url)
    if (data.results.length === 0) {
      break
    }

    all.push(...data.results)
    if (data.count !== undefined) {
      totalCount = data.count
    }

    if (!shouldFetchNextPage(all.length, data.results.length, totalCount)) {
      break
    }

    offset += data.results.length
  }

  if (totalCount !== undefined && all.length < totalCount) {
    console.warn(
      `[sitemap] Tenants incomplete: loaded ${all.length} of ${totalCount}`
    )
  }

  return all
}

export async function fetchAllCitiesForSitemap<T>(): Promise<T[]> {
  const apiBase = getSitemapApiBaseUrl()

  try {
    const url = `${apiBase}/api/cities/`
    console.log(`[sitemap] Fetching cities from: ${url}`)

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Таймаут для предотвращения зависания
      signal: AbortSignal.timeout(30000), // 30 секунд
    })

    if (!response.ok) {
      console.error(
        `[sitemap] Error fetching cities: ${response.status} ${response.statusText}`
      )

      // Пытаемся получить текст ошибки
      try {
        const errorText = await response.text()
        console.error(`[sitemap] Error response: ${errorText}`)
      } catch (e) {
        console.error(`[sitemap] Could not read error response`)
      }

      return []
    }

    const data = await response.json()

    // Бэкенд возвращает массив городов (без пагинации)
    const cities = Array.isArray(data) ? data : data.results || []

    console.log(`[sitemap] ✓ Fetched ${cities.length} cities`)

    // Выводим примеры городов для отладки
    if (cities.length > 0) {
      const sampleSize = Math.min(5, cities.length)
      console.log(`[sitemap] Sample cities (first ${sampleSize}):`)
      cities.slice(0, sampleSize).forEach((city: any, index: number) => {
        console.log(
          `[sitemap]   ${index + 1}. ${city.name} (slug: ${city.slug}, nomenclatures: ${city.nomenclature_count || 0})`
        )
      })
    }

    return cities
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      console.error('[sitemap] ❌ Timeout fetching cities (30s)')
    } else if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(
        '[sitemap] ❌ Network error fetching cities:',
        error.message
      )
    } else {
      console.error('[sitemap] ❌ Error fetching cities:', error)
    }
    return []
  }
}
