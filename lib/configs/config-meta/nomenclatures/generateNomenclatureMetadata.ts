import { INomenclatureDetailsItem } from '@/types/nomenclature'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'

export function generateNomenclatureStructuredData(
  nomenclature: INomenclatureDetailsItem,
  id: string
) {
  const {
    main_info,
    brand,
    exterior,
    interior,
    article,
    pricePerMonth,
    created_at,
    updated_at,
  } = nomenclature
  const images = [...exterior, ...interior]
    .map((img) => img.source)
    .filter(Boolean)
  const productUrl = `${SITE_URL}/nomenclatures/${id}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': productUrl,
    name: main_info.name,
    description: main_info.description || undefined,
    sku: String(article),
    productID: id,
    url: productUrl,
    datePublished: created_at ? new Date(created_at).toISOString() : undefined, // ✅ Добавлено
    dateModified: updated_at ? new Date(updated_at).toISOString() : undefined, // ✅ Добавлено
    author: {
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
    offers: {
      '@type': 'Offer',
      price: pricePerMonth || '0',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      url: productUrl,
      seller: {
        '@type': 'Organization',
        name: 'Агентство активной рекламы КрасРМ',
      },
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Тип контента',
        value: nomenclature.contentType,
      },
      {
        '@type': 'PropertyValue',
        name: 'Тип места',
        value: nomenclature.typeOfPlace,
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
