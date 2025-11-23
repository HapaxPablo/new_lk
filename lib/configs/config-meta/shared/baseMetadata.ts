import { Metadata } from 'next'

export const baseMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
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