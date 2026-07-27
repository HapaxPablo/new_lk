export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!

export const metaDataConfigLayout = {
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
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Агентство активной рекламы КрасРМ',
    description: 'Агентство активной рекламы в Красноярске',
    url: SITE_URL,
    siteName: 'КрасРМ',
    images: [
      {
        url: `${SITE_URL}/logo_footer.svg`,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ru_RU',
    type: 'website',
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
