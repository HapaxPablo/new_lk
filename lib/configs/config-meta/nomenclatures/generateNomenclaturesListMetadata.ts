import { Metadata } from 'next'

interface GenerateNomenclaturesListMetadataParams {
  search?: string
  brand_name?: string
}

export function generateNomenclaturesListMetadata({
  search = '',
  brand_name = ''
}: GenerateNomenclaturesListMetadataParams): Metadata {
  const hasSearch = !!search
  const hasBrandFilter = !!brand_name

  let title = 'Каталог номенклатуры | RMC'
  let description = 'Просмотрите наш полный каталог номенклатуры. Найдите нужные товары и материалы.'

  if (hasSearch && hasBrandFilter) {
    title = `Поиск: "${search}" | Бренд: ${brand_name} | Каталог номенклатуры`
    description = `Результаты поиска по запросу "${search}" в бренде "${brand_name}" в каталоге номенклатуры`
  } else if (hasSearch) {
    title = `Поиск: "${search}" | Каталог номенклатуры`
    description = `Результаты поиска по запросу "${search}" в каталоге номенклатуры`
  } else if (hasBrandFilter) {
    title = `Бренд: ${brand_name} | Каталог номенклатуры`
    description = `Номенклатуры бренда "${brand_name}" в каталоге`
  }

  const keywords = hasSearch 
    ? [
        `поиск ${search}`,
        'номенклатура',
        'каталог',
        'места размещения рекламы',
        ...search.split(' '),
      ]
    : [
        'номенклатура',
        'каталог',
        'товары',
        'материалы',
        'места размещения рекламы',
      ]

  // Добавляем бренд в ключевые слова если есть фильтр
  if (hasBrandFilter) {
    keywords.unshift(brand_name)
  }

  const canonicalUrl = hasSearch 
    ? `https://lk.krasrm.com/nomenclatures?searchValue=${encodeURIComponent(search)}`
    : 'https://lk.krasrm.com/nomenclatures'

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