'use client'

import Image from 'next/image'
import { MapPin, MapPinHouse, RussianRuble } from 'lucide-react'
import styles from './CardNomenclature.module.scss'
import { formatPrice } from '@/utils'
import { LinkButton } from '../button/LinkButton'
import Link from 'next/link'
import { Button } from '../button/Button'
import { AddToCartButton } from './AddToCartButton'
import { trackSelectItem } from '@/lib/ecommerce/ecommerceHelpers'

interface CardNomenclatureProps {
  className?: string
  item: any
  codeMP?: string | null
}

export const CardNomenclature: React.FC<CardNomenclatureProps> = ({
  item,
  className = '',
  codeMP = null,
}) => {
  const { brand, exterior, typeOfPlace, pricePerMonth, brandName } = item
  const mainImage = Array.isArray(exterior) ? exterior[0]?.source : exterior

  const hasImage = Boolean(mainImage)
  const logoSrc = brand?.logotype

  const formattedPrice = pricePerMonth
    ? `от ${formatPrice(pricePerMonth)}/день`
    : 'Цена не указана'

  const formattedAddress =
    typeof item.formattedAddress === 'string'
      ? item.formattedAddress
      : (item.formattedAddress?.name ?? 'Адрес не указан')

  // The API returns this field as an object for nomenclature details, while
  // some list responses still contain a string. React cannot render the
  // object directly, which caused error #31 on the order page.
  const typeOfPlaceLabel =
    typeof typeOfPlace === 'string'
      ? typeOfPlace
      : (typeOfPlace?.name || typeOfPlace?.abbreviation || 'Тип не указан')

  const handleCardClick = () => {
    // Отслеживаем клик в Яндекс.Метрику
    trackSelectItem(
      {
        item_id: item.id,
        item_name: item.nameForFront,
        item_category: typeOfPlaceLabel,
        item_brand: item.brand?.name,
        price: item.pricePerMonth,
      },
      'Список номенклатур'
    )
  }

  return (
    <article className={`${styles.card} ${className}`}>
      <Link
        href={`/nomenclatures/${item.oldCatalogSlug ? item.oldCatalogSlug : item.id}`}
        className={styles.cardLink}
        onClick={handleCardClick}
      >
        <div className={styles.cardContent}>
          <div className={styles.mediaSection}>
            <div className={styles.imageWrapper}>
              {hasImage ? (
                <Image
                  src={mainImage}
                  alt={`Фасад ${brand?.name || 'места'}`}
                  fill
                  className={styles.image}
                  sizes="80px"
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <Image
                    src="/og-logo.jpg"
                    alt="Логотип"
                    width={200}
                    height={100}
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            {logoSrc && mainImage && (
              <div className={styles.logoWrapper}>
                <Image
                  src={logoSrc}
                  alt={`Логотип ${brand?.name}`}
                  fill
                  className={styles.logo}
                  sizes="80px"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoRow}>
              <MapPinHouse className={styles.icon} size={16} />
              <div className={styles.textContent}>
                <span className={styles.primaryText}>
                  {typeOfPlaceLabel}
                  {brand?.name ? ` • ${brand.name}` : ''}
                  {brandName && ` • ${brandName}`}
                </span>
              </div>
            </div>

            <div className={styles.infoRow}>
              <MapPin className={styles.icon} size={16} />
              <div className={styles.textContent}>
                <span className={styles.secondaryText}>{formattedAddress}</span>
              </div>
            </div>

            <div className={styles.infoRow}>
              <RussianRuble className={styles.icon} size={16} />
              <div className={styles.textContent}>
                <span className={styles.priceText}>{formattedPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className={styles.actionsSection}>
        <LinkButton href={`/nomenclatures/${item.id}`} variant="default">
          Подробнее
        </LinkButton>

        {codeMP ? (
          <LinkButton href={`/nomenclatures/${item.id}`} variant="navigate">
            Перейти в медиаплан
          </LinkButton>
        ) : (
          <AddToCartButton item={item} />
        )}
      </div>
    </article>
  )
}
