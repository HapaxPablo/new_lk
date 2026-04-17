import { MetadataRoute } from 'next'

const SITE_URL = 'https://krasrm.com'

// Статические маршруты
const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: `${SITE_URL}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  },
  {
    url: `${SITE_URL}/nomenclatures`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/counterparties`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/promotions`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/content`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${SITE_URL}/media-plans`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/order`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${SITE_URL}/tasks`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/my-place`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes
}
