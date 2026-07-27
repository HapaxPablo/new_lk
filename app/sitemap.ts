import { buildSitemapEntries } from '@/lib/sitemap/build-entries'
import type { MetadataRoute } from 'next'

/**
 * Не генерировать sitemap при docker build / CI — API с раннера часто недоступен
 * или обрывает тяжёлый ответ (limit=500). Сборка только на работающем сервере.
 */
export const dynamic = 'force-dynamic'

/** Должен быть литерал. Кэш ответа /sitemap.xml на 1 ч. */
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries()
}
