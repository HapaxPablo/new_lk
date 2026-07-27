import { Metadata } from 'next'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'

interface GenerateOrderMetadataParams {
  itemCount?: number
}

export function generateOrderMetadata({
  itemCount = 0,
}: GenerateOrderMetadataParams): Metadata {
  const title = `Оформление заказа (${itemCount}) | КрасРМ`

  const description =
    itemCount > 0
      ? `Оформите заказ на размещение рекламы. Выбрано позиций: ${itemCount}. Укажите параметры и отправьте заявку.`
      : `Оформление заказа на размещение рекламы. Выберите места размещения и настройте параметры.`

  const url = `${SITE_URL}/order`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      siteName: 'КрасРМ',
      images: [
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
      title,
      description,
      images: [`${SITE_URL}/logo_footer.svg`],
    },
    alternates: {
      canonical: url,
    },

    robots: {
      index: false,
      follow: false,
    },
  }
}
