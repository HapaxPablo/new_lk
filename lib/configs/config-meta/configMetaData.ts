export const metaDataConfigLayout = {
  title: 'RMC',
  description: 'Описание  сайта для SEO',
  keywords: ['ключевое слово 1', 'ключевое слово 2', 'ключевое слово 3'],
  icons: {
    icon: '/favicon.ico', // или '/favicon-32x32.png'
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Название для соцсетей',
    description: 'Описание для соцсетей',
    url: 'https://нашсайт.ру',
    siteName: 'Название сайта',
    images: [
      {
        url: 'https://нашсайт.ру/og-image.jpg',
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
    google: 'google',
    yandex: 'yandex',
    other: {
      me: ['my-email', 'my-link'],
    },
  },
}
