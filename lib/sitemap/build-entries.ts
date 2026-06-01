import type { MetadataRoute } from 'next'
import { IBrandListItem } from '@/types/brands'
import { INomenclatureItem, ITenantsListItem } from '@/types/nomenclature'
import {
  fetchAllBrandsForSitemap,
  fetchAllNomenclaturesForSitemap,
  fetchAllTenantsForSitemap,
} from './fetch-paginated'
import {
  absoluteSitePath,
  getSitemapApiBaseUrl,
  getSitemapSiteUrl,
} from './urls'

function staticEntries(): MetadataRoute.Sitemap {
  const routes: Array<{
    path: string
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
    priority: number
  }> = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/nomenclatures', changeFrequency: 'daily', priority: 0.95 },
    { path: '/brands', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/tenants', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/accreditation', changeFrequency: 'monthly', priority: 0.85 },
  ]

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: absoluteSitePath(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSitemapSiteUrl()
  const apiBase = getSitemapApiBaseUrl()

  console.info(`[sitemap] Building for ${siteUrl}, API base: ${apiBase}`)

  const entries: MetadataRoute.Sitemap = [...staticEntries()]
  // В списке api/nomenclatures/ нет updated_at — дата = момент сборки sitemap
  const generatedAt = new Date()

  // Последовательно: при build/CI меньше параллельных коннектов к API
  const nomenclatures =
    await fetchAllNomenclaturesForSitemap<INomenclatureItem>()
  const brands = await fetchAllBrandsForSitemap<IBrandListItem>()
  const tenants = await fetchAllTenantsForSitemap<ITenantsListItem>()

  console.info(
    `[sitemap] Loaded ${nomenclatures.length} nomenclatures, ${brands.length} brands`
  )

  const seen = new Set(entries.map((e) => e.url))

  for (const item of nomenclatures) {
    if (!item.id) {
      continue
    }

    const url = absoluteSitePath(`/nomenclatures/${item.id}`)
    if (seen.has(url)) {
      continue
    }

    seen.add(url)
    entries.push({
      url,
      lastModified: generatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  for (const tenant of tenants) {
    if (!tenant.id) {
      continue
    }
    const url = absoluteSitePath(`/tenants/${tenant.id}`)
    if (seen.has(url)) {
      continue
    }
    seen.add(url)
    entries.push({
      url,
      lastModified: generatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
    if (nomenclatures.length === 0 && tenants.length === 0) {
      console.warn(
        '[sitemap] No dynamic URLs — check API_1C_URL and public access to api/nomenclatures/ and api/brands/assigned'
      )
    }
  }

  for (const brand of brands) {
    if (!brand.slug) {
      continue
    }

    const url = absoluteSitePath(`/brands/${brand.slug}`)
    if (seen.has(url)) {
      continue
    }

    seen.add(url)
    entries.push({
      url,
      lastModified: generatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  if (nomenclatures.length === 0 && brands.length === 0) {
    console.warn(
      '[sitemap] No dynamic URLs — check API_1C_URL and public access to api/nomenclatures/ and api/brands/assigned'
    )
  }

  return entries
}
