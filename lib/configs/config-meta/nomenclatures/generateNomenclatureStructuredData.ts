import { INomenclatureDetailsItem } from '@/types/nomenclature'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
import { formatPlaceTitle } from '@/utils'

export function generateNomenclatureStructuredData(
  nomenclature: INomenclatureDetailsItem,
  id: string
) {
  const {
    // main_info,
    brand,
    exterior,
    interior,
    article,
    pricePerMonth,
  } = nomenclature
  const metaName = formatPlaceTitle(nomenclature, 'meta')
  const phoneNumber = '8 800 222 59 38' // Можно вынести в конфиг
  const description = `Размещение аудио и видеорекламы в ${metaName}. Звоните: ☎ ${phoneNumber}`
  const images = [...exterior, ...interior]
    .map((img) => img.source)
    .filter(Boolean)
  const productUrl = `${SITE_URL}/nomenclatures/${id}`
  const hasPrice =
    typeof pricePerMonth === 'number' &&
    Number.isFinite(pricePerMonth) &&
    pricePerMonth > 0

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': productUrl,
    name: `Размещение рекламы в ${metaName}`,
    description: description || undefined,
    identifier: String(article || id),
    url: productUrl,
    provider: {
      '@type': 'Organization',
      name: 'Агентство активной рекламы КрасРМ',
      url: SITE_URL,
    },
    brand: brand
      ? {
          '@type': 'Brand',
          name: brand.name,
          logo: brand.logotype || undefined,
        }
      : undefined,
    image: images.length > 0 ? images : undefined,
    offers: hasPrice
      ? {
          '@type': 'Offer',
          price: String(pricePerMonth),
          priceCurrency: 'RUB',
          url: productUrl,
          seller: {
            '@type': 'Organization',
            name: 'Агентство активной рекламы КрасРМ',
          },
        }
      : undefined,
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Тип контента',
        value: nomenclature.contentType,
      },
      {
        '@type': 'PropertyValue',
        name: 'Тип места',
        value: nomenclature.typeOfPlace.name,
      },
      ...(nomenclature.legalEntity?.name
        ? [
            {
              '@type': 'PropertyValue' as const,
              name: 'Юридическое лицо',
              value: nomenclature.legalEntity.name,
            },
          ]
        : []),
    ],
  }
}
