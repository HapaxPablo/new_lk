import {
  SITEMAP_MAX_PAGES,
  SITEMAP_PAGE_SIZE,
  SITEMAP_REVALIDATE_SECONDS,
} from './config'
import { buildSitemapApiUrl } from './urls'

export interface PaginatedApiResponse<T> {
  results: T[]
  count?: number
  next: string | null
  previous?: string | null
}

async function fetchPaginatedPage<T>(
  url: string
): Promise<PaginatedApiResponse<T>> {
  try {
    const res = await fetch(url, {
      next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(30_000),
    })

    if (!res.ok) {
      console.warn(
        `[sitemap] ${res.status} ${res.statusText} for ${url}`
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

  while (page <= SITEMAP_MAX_PAGES) {
    const url = buildSitemapApiUrl('api/nomenclatures/', {
      limit: String(SITEMAP_PAGE_SIZE),
      page: String(page),
    })

    const data = await fetchPaginatedPage<T>(url)
    all.push(...data.results)

    if (!data.next || data.results.length < SITEMAP_PAGE_SIZE) {
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

  for (let page = 0; page < SITEMAP_MAX_PAGES; page += 1) {
    const url = buildSitemapApiUrl('api/brands/assigned', {
      limit: String(SITEMAP_PAGE_SIZE),
      offset: String(offset),
    })

    const data = await fetchPaginatedPage<T>(url)
    all.push(...data.results)

    if (!data.next || data.results.length < SITEMAP_PAGE_SIZE) {
      break
    }

    offset += SITEMAP_PAGE_SIZE
  }

  return all
}
