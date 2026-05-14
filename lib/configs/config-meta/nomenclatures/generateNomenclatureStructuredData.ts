import { Metadata } from 'next'
import { INomenclatureDetailsItem } from '@/types/nomenclature'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'

interface GenerateMetadataParams {
  nomenclature: INomenclatureDetailsItem
  id: string
}

export function generateNomenclatureMetadata({
  nomenclature,
  id,
}: GenerateMetadataParams): Metadata {
  const {
    main_info,
    brand,
    exterior,
    interior,
    article,
    pricePerMonth,
    nameForFront,
  } = nomenclature

  const fullTitle = `${nameForFront} | Агентство активной рекламы КрасРМ`
  const canonicalUrl = `${SITE_URL}/nomenclatures/${id}`

  const metaDescription = main_info.description
    ? `${main_info.description.substring(0, 160)}${main_info.description.length > 160 ? '...' : ''}`
    : `Информация о номенклатуре ${main_info.name}. ${brand ? `Бренд: ${brand.name}.` : ''} Артикул: ${article}.`

  const images = [...exterior, ...interior]
  const mainImage = images.length > 0 ? images[0].source : null

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: [
      main_info.name,
      String(article),
      brand?.name || '',
      'номенклатура',
      'реклама',
      'места размещения',
      'КрасРМ',
      nomenclature.contentType,
      nomenclature.typeOfPlace,
    ].filter(Boolean),
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      type: 'website', // ✅ Измено с 'article' на 'website'
      url: canonicalUrl,
      siteName: 'КрасРМ',
      images: mainImage
        ? [
            {
              url: mainImage,
              width: 800,
              height: 600,
              alt: main_info.name,
              type: 'image/jpeg',
            },
          ]
        : [
            {
              url: `${SITE_URL}/logo_footer.svg`,
              width: 1200,
              height: 630,
              alt: 'КрасРМ',
            },
          ],
      locale: 'ru_RU',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: mainImage ? [mainImage] : [`${SITE_URL}/logo_footer.svg`],
      creator: '@krasrm', // ← Опционально, если есть Twitter аккаунт
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'og:price:amount': pricePerMonth || '0',
      'og:price:currency': 'RUB',
      'article:author': 'Команда АРЭМСИ 24', // ← Альтернативное место для автора
    },
  }
}

export function generateNotFoundMetadata(): Metadata {
  return {
    title: 'Номенклатура не найдена | RMC',
    description: 'Запрошенная номенклатура не найдена в системе.',
    robots: {
      index: false,
      follow: false,
    },
  }
}
