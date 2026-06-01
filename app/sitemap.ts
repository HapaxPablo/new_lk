import { buildSitemapEntries } from '@/lib/sitemap/build-entries'
import { SITEMAP_REVALIDATE_SECONDS } from '@/lib/sitemap/config'
import type { MetadataRoute } from 'next'

export const revalidate = SITEMAP_REVALIDATE_SECONDS

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries()
}
