import { MetadataRoute } from 'next'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!
const API_URL = process.env.API_1C_URL!

async function getNomenclatures() {
  const res = await fetch(`${API_URL}/nomenclatures?limit=99999`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    return []
  }

  return res.json()
}

async function getBrands() {
  const res = await fetch(`${API_URL}/brands?limit=99999`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    return []
  }

  return res.json()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
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

  const nomenclatureRoutes: MetadataRoute.Sitemap = nomenclatures.results.map(
    (item: any) => ({
      url: `${SITE_URL}/nomenclatures/${item.slug}`,
      lastModified: item.updated_at || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  )

  const brands = await getBrands()

  const brandRoutes: MetadataRoute.Sitemap = brands.results.map(
    (brand: any) => ({
      url: `${SITE_URL}/brands/${brand.slug}`,
      lastModified: brand.updated_at || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  )

  return [...staticRoutes, ...nomenclatureRoutes, ...brandRoutes]
}
