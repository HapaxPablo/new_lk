import { Metadata } from 'next'
import { SITE_URL } from '../configMetaData'

interface GenerateNomenclaturesListMetadataParams {
  search?: string
  brand_name?: string
}

export function generateNomenclaturesListMetadata({
  search = '',
  brand_name = '',
}: GenerateNomenclaturesListMetadataParams): Metadata {
  const hasSearch = !!search
  const hasBrandFilter = !!brand_name

  // Базовые шаблоны
  let title = 'Indoor реклама внутри помещений в Красноярске | «RMC»'
  let description =
    'Размещение indoor рекламы на территории России в торговых центрах, гипермаркетах и магазинах. Звуковая и видео реклама внутри помещений. Агентство рекламы «RMC». Звоните: ☎ 8 800 222 59 38'
  let h1 = 'Оператор Indoor рекламы - «RMC»'

  // Модификация шаблонов при наличии поиска/фильтра
  if (hasSearch && hasBrandFilter) {
    title = `Поиск: "${search}" | Бренд: ${brand_name} | Indoor реклама в Красноярске | «RMC»`
    description = `Результаты поиска indoor рекламы по запросу "${search}" в бренде "${brand_name}". Размещение рекламы в помещениях. Звоните: ☎ 8 800 222 59 38`
  } else if (hasSearch) {
    title = `Поиск: "${search}" | Indoor реклама в Красноярске | «RMC»`
    description = `Результаты поиска indoor рекламы по запросу "${search}". Размещение аудио и видео рекламы внутри помещений. Звоните: ☎ 8 800 222 59 38`
  } else if (hasBrandFilter) {
    title = `Бренд: ${brand_name} | Indoor реклама в помещениях | «RMC»`
    description = `Размещение indoor рекламы бренда "${brand_name}" в торговых центрах и магазинах. Агентство рекламы «RMC». Звоните: ☎ 8 800 222 59 38`
  }

  const keywords = hasSearch
    ? [
        `поиск ${search}`,
        'indoor реклама',
        'реклама в помещениях',
        'размещение рекламы',
        'Красноярск',
        ...search.split(' '),
      ]
    : [
        'indoor реклама',
        'реклама в помещениях',
        'размещение рекламы',
        'торговые центры',
        'Красноярск',
        'RMC',
      ]

  if (hasBrandFilter) {
    keywords.unshift(brand_name)
  }

  const canonicalUrl = hasSearch
    ? `${SITE_URL}/nomenclatures?searchValue=${encodeURIComponent(search)}`
    : `${SITE_URL}/nomenclatures`

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'RMC',
      images: [
        {
          url: 'https://krasrm.com/og-logo.jpg',
          width: 1200,
          height: 630,
        },
      ],
      locale: 'ru_RU',
      type: 'website',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
