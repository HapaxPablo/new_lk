export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!

export const metaDataConfigLayout = {
  metadataBase: new URL(SITE_URL),
  title: 'Агентство активной рекламы КрасРМ',
  description:
    'Агентство активной рекламы в Красноярске. Реклама, маркетинг, промоции и номенклатуры товаров.',
  keywords: [
    'агентство рекламы',
    'активная реклама',
    'Красноярск',
    'маркетинг',
    'промоции',
  ],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Агентство активной рекламы КрасРМ',
    description: 'Агентство активной рекламы в Красноярске',
    url: SITE_URL,
    siteName: 'КрасРМ',
    images: [
      {
        url: `${SITE_URL}/og-logo.jpg`,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Агентство активной рекламы КрасРМ',
    description: 'Размещение indoor-рекламы в Красноярске и по России.',
    images: [`${SITE_URL}/og-logo.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      iopageindex: false,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || '',
  },
}

/**
 * Генерирует canonical URL для страницы
 * @param pathname - путь страницы (например: '/nomenclatures/123')
 * @returns полный canonical URL
 */
export const getCanonicalUrl = (pathname: string = '') => {
  return `${SITE_URL}/${pathname}`
}
