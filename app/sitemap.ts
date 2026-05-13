import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
import { IBrandListResponse } from '@/types/brands'
import { INomenclatureResponse } from '@/types/nomenclature'
import { MetadataRoute } from 'next'

export const revalidate = 3600

const API_URL = process.env.API_1C_URL

if (!SITE_URL || !API_URL) {
  throw new Error('Missing SITE_URL or API_URL env variables')
}

/**
 * Универсальный safe-fetch
 * защищает от:
 * - null
 * - HTML вместо JSON
 * - битых API ответов
 */
async function safeFetch<T>(url: string): Promise<T & { results: any[] }> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return { results: [] } as any
    }

    const data = await res.json()

    if (!data || !Array.isArray(data.results)) {
      return { results: [] } as any
    }

    return data
  } catch {
    return { results: [] } as any
  }
}

/**
 * Используем твои типы,
 * но с runtime safety
 */
async function getNomenclatures(): Promise<INomenclatureResponse> {
  return safeFetch<INomenclatureResponse>(
    `${API_URL}/nomenclatures?limit=99999`
  )
}

async function getBrands(): Promise<IBrandListResponse> {
  return safeFetch<IBrandListResponse>(`${API_URL}/brands?limit=99999`)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL || 'http://192.168.0.8:8000/',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/nomenclatures`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/promotions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  const nomenclatures = await getNomenclatures()
  const brands = await getBrands()

  const nomenclatureRoutes: MetadataRoute.Sitemap = (
    nomenclatures?.results ?? []
  ).map((item: any) => ({
    url: `${SITE_URL}/nomenclatures/${item.id}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const brandRoutes: MetadataRoute.Sitemap = (brands?.results ?? []).map(
    (brand: any) => ({
      url: `${SITE_URL}/brands/${brand.slug}`,
      lastModified: brand.updated_at ? new Date(brand.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  )

  return [...staticRoutes, ...nomenclatureRoutes, ...brandRoutes]
}
