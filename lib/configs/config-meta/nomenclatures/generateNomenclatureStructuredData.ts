import { Metadata } from 'next'
import { INomenclatureDetailsItem } from '@/types/nomenclature'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
import { formatPlaceTitle } from '@/utils'

interface GenerateMetadataParams {
  nomenclature: INomenclatureDetailsItem
  id: string
}

export function generateNomenclatureMetadata({
  nomenclature,
  id,
}: GenerateMetadataParams): Metadata {
  const {
    // main_info,
    brand,
    exterior,
    interior,
    article,
    pricePerMonth,
  } = nomenclature

  // Получаем адрес из main_info или других полей
  const fullName = formatPlaceTitle(nomenclature, 'full')
  // console.log('fullName generateNomenclatureStructuredData', fullName)

  // Шаблонный title для карточки товара
  const title = `Размещение Indoor рекламы в помещении ${fullName}`

  // Шаблонный h1 (будет использоваться на странице)
  const h1 = fullName

  // Шаблонный description
  const phoneNumber = '8 800 222 59 38' // Можно вынести в конфиг
  const description = `Размещение аудио и видеорекламы в помещении по адресу ${fullName}. Звоните: ☎ ${phoneNumber}`

  const canonicalUrl = `${SITE_URL}/nomenclatures/${id}`

  const images = [...exterior, ...interior]
  const mainImage = images.length > 0 ? images[0].source : null

  return {
    title,
    description,
    // Передаем h1 через другие метаданные для использования на странице
    other: {
      'page-h1': h1,
      'og:price:amount': pricePerMonth || '0',
      'og:price:currency': 'RUB',
    },
    keywords: [
      'indoor реклама',
      'реклама в помещении',
      fullName,
      // main_info.name,
      String(article),
      brand?.name || '',
      'размещение рекламы',
      'Красноярск',
      'RMC',
      nomenclature.contentType,
      nomenclature.typeOfPlace.name,
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'RMC',
      images: mainImage
        ? [
            {
              url: mainImage,
              width: 800,
              height: 600,
              alt: fullName,
              type: 'image/jpeg',
            },
          ]
        : [
            {
              url: `${SITE_URL}/logo_footer.svg`,
              width: 1200,
              height: 630,
              alt: 'RMC Indoor реклама',
            },
          ],
      locale: 'ru_RU',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: mainImage ? [mainImage] : [`${SITE_URL}/logo_footer.svg`],
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
  }
}

export function generateNotFoundMetadata(): Metadata {
  return {
    title: 'Indoor реклама не найдена | RMC',
    description:
      'Запрошенная страница с indoor рекламой не найдена. Свяжитесь с нами: ☎ 8 800 222 59 38',
    robots: {
      index: false,
      follow: false,
    },
  }
}
