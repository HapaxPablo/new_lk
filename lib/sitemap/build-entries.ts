// sitemap.ts (полная версия с последовательной загрузкой)

import type { MetadataRoute } from 'next'
import { IBrandListItem } from '@/types/brands'
import { INomenclatureItem } from '@/types/nomenclature'
import { IGroupedTenant } from '@/types/tenants'
import { ICitySitemap } from '@/types/cities'
import {
  fetchAllBrandsForSitemap,
  fetchAllNomenclaturesForSitemap,
  fetchAllTenantsForSitemap,
  fetchAllCitiesForSitemap,
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
    { path: '/places', changeFrequency: 'daily', priority: 0.9 },
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
  const generatedAt = new Date()

  try {
    // Последовательная загрузка для снижения нагрузки на API
    console.info('[sitemap] Step 1/4: Fetching nomenclatures...')
    const nomenclatures =
      await fetchAllNomenclaturesForSitemap<INomenclatureItem>()
    console.info(`[sitemap] ✓ Loaded ${nomenclatures.length} nomenclatures`)

    console.info('[sitemap] Step 2/4: Fetching brands...')
    const brands = await fetchAllBrandsForSitemap<IBrandListItem>()
    console.info(`[sitemap] ✓ Loaded ${brands.length} brands`)

    console.info('[sitemap] Step 3/4: Fetching tenants...')
    const tenants = await fetchAllTenantsForSitemap<IGroupedTenant>()
    console.info(`[sitemap] ✓ Loaded ${tenants.length} tenants`)

    console.info('[sitemap] Step 4/4: Fetching cities...')
    const cities = await fetchAllCitiesForSitemap<ICitySitemap>()
    console.info(`[sitemap] ✓ Loaded ${cities.length} cities`)

    console.info(
      `[sitemap] Total loaded: ${nomenclatures.length} nomenclatures, ${brands.length} brands, ${tenants.length} tenants, ${cities.length} cities`
    )

    const seen = new Set(entries.map((e) => e.url))

    // Добавляем номенклатуры
    console.info(
      `[sitemap] Adding ${nomenclatures.length} nomenclature URLs...`
    )
    let nomenclatureAdded = 0
    for (const item of nomenclatures) {
      if (!item.id) {
        console.warn(`[sitemap] Skipping nomenclature without id`)
        continue
      }

      const url = absoluteSitePath(`/nomenclatures/${item.id}`)
      if (seen.has(url)) {
        console.warn(`[sitemap] Duplicate nomenclature URL: ${url}`)
        continue
      }

      seen.add(url)
      entries.push({
        url,
        lastModified: generatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
      nomenclatureAdded++
    }
    console.info(`[sitemap] ✓ Added ${nomenclatureAdded} nomenclature URLs`)

    // Добавляем тенантов
    console.info(`[sitemap] Adding ${tenants.length} tenant URLs...`)
    let tenantsAdded = 0
    for (const tenant of tenants) {
      if (!tenant.tenantId) {
        console.warn(`[sitemap] Skipping tenant without tenantId`)
        continue
      }

      const url = absoluteSitePath(`/tenants/${tenant.tenantId}`)
      if (seen.has(url)) {
        console.warn(`[sitemap] Duplicate tenant URL: ${url}`)
        continue
      }

      seen.add(url)
      entries.push({
        url,
        lastModified: generatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
      tenantsAdded++
    }
    console.info(`[sitemap] ✓ Added ${tenantsAdded} tenant URLs`)

    // Добавляем бренды
    console.info(`[sitemap] Adding ${brands.length} brand URLs...`)
    let brandsAdded = 0
    for (const brand of brands) {
      if (!brand.slug) {
        console.warn(`[sitemap] Skipping brand without slug`)
        continue
      }

      const url = absoluteSitePath(`/brands/${brand.slug}`)
      if (seen.has(url)) {
        console.warn(`[sitemap] Duplicate brand URL: ${url}`)
        continue
      }

      seen.add(url)
      entries.push({
        url,
        lastModified: generatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
      brandsAdded++
    }
    console.info(`[sitemap] ✓ Added ${brandsAdded} brand URLs`)

    // Добавляем города (places)
    console.info(`[sitemap] Adding ${cities.length} place URLs...`)
    let placesAdded = 0
    for (const city of cities) {
      if (!city.slug) {
        console.warn(`[sitemap] Skipping city without slug: ${city.name}`)
        continue
      }

      const url = absoluteSitePath(`/places/${city.slug}`)
      if (seen.has(url)) {
        console.warn(`[sitemap] Duplicate place URL: ${url}`)
        continue
      }

      seen.add(url)
      entries.push({
        url,
        lastModified: generatedAt,
        changeFrequency: 'daily',
        priority: 0.8,
      })
      placesAdded++
    }
    console.info(`[sitemap] ✓ Added ${placesAdded} place URLs`)

    // Проверка на пустой sitemap
    if (
      nomenclatures.length === 0 &&
      brands.length === 0 &&
      tenants.length === 0 &&
      cities.length === 0
    ) {
      console.warn(
        '[sitemap] ⚠ No dynamic URLs generated — check API connections and data availability'
      )
    }

    console.info(`[sitemap] ✅ Total sitemap entries: ${entries.length}`)
    console.info(
      `[sitemap] Breakdown: Static=${staticEntries().length}, Dynamic=${entries.length - staticEntries().length}`
    )
  } catch (error) {
    console.error('[sitemap] ❌ Critical error building sitemap:', error)
    if (error instanceof Error) {
      console.error(`[sitemap] Error message: ${error.message}`)
      console.error(`[sitemap] Error stack: ${error.stack}`)
    }
    // Возвращаем хотя бы статические страницы в случае ошибки
    console.warn(
      `[sitemap] ⚠ Returning ${entries.length} entries (static only) due to error`
    )
  }

  return entries
}
