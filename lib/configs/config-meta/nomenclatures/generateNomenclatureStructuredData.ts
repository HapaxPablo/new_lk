import { INomenclatureDetailsItem } from '@/types/nomenclature'

export function generateNomenclatureStructuredData(
  nomenclature: INomenclatureDetailsItem, 
  id: string
) {
  const { main_info, brand, exterior, interior, article, pricePerMonth } = nomenclature
  const images = [...exterior, ...interior].map(img => img.source)
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: main_info.name,
    description: main_info.description,
    sku: String(article),
    productID: id,
    brand: brand ? {
      '@type': 'Brand',
      name: brand.name,
      logo: brand.logotype
    } : undefined,
    image: images,
    offers: {
      '@type': 'Offer',
      price: pricePerMonth || '0',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXTAUTH_URL}/nomenclatures/${id}`
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Тип контента',
        value: nomenclature.contentType
      },
      {
        '@type': 'PropertyValue',
        name: 'Тип места',
        value: nomenclature.typeOfPlace
      },
      {
        '@type': 'PropertyValue',
        name: 'Юридическое лицо',
        value: nomenclature.legalEntity?.name
      }
    ]
  }
}