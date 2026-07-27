import { Metadata } from 'next'

export const baseMetadata: Metadata = {
  // metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: 'RMC - Агентство активной рекламы в Красноярске',
  description:
    'Агентство активной рекламы в Красноярске. Реклама, маркетинг, акции и размещение рекламы в торговых центрах.',
  keywords: [
    'агентство рекламы',
    'активная реклама',
    'размещение рекламы',
    'индор реклама',
    'размещение рекламы в магазинах',
    'реклама в торговых центрах',
    'реклама в магазинах',
  ],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  authors: [{ name: 'RMC' }],
  creator: 'RMC',
  publisher: 'RMC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export const openGraphBase = {
  siteName: 'RMC',
  locale: 'ru_RU',
  type: 'website' as const,
}

export const twitterBase = {
  card: 'summary_large_image' as const,
  creator: '@RMC',
}
