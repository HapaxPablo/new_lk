import { buildSitemapEntries } from '@/lib/sitemap/build-entries'
import type { MetadataRoute } from 'next'

/** Должен быть литерал — Next.js не принимает импорт (см. lib/sitemap/config.ts). */
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries()
}
