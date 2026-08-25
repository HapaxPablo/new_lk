'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { formatPrice, getNomenclatureTitle } from '@/utils'
import { trackSelectItem } from '@/lib/ecommerce/ecommerceHelpers'
import { AddToCartButton } from './AddToCartButton'
import { EntityCard } from './EntityCard'
import styles from './CardNomenclature.module.scss'
import { usePathname } from 'next/navigation'

interface CardNomenclatureProps {
  className?: string
  item: any
  codeMP?: string | null
  compact?: boolean
  onSelect?: (id: string) => void
  selected?: boolean
}

export const CardNomenclature: React.FC<CardNomenclatureProps> = ({
  item,
  className = '',
  codeMP = null,
  compact = false,
  onSelect,
  selected = false,
}) => {
  const { exterior, typeOfPlace, pricePerMonth } = item
  const image = Array.isArray(exterior) ? exterior[0]?.source : exterior
  const brandLogo = item.brand?.logotype
  const address =
    typeof item.formattedAddress === 'string'
      ? item.formattedAddress
      : item.formattedAddress?.name || 'Адрес уточняется'
  const placeType =
    typeof typeOfPlace === 'string'
      ? typeOfPlace
      : typeOfPlace?.name || typeOfPlace?.abbreviation || 'Рекламная площадка'
  const href = `/nomenclatures/${item.oldCatalogSlug || item.id}`

  const handleCardClick = () => {
    onSelect?.(item.id)
    trackSelectItem(
      {
        item_id: item.id,
        item_name: getNomenclatureTitle(item),
        item_category: placeType,
        item_brand: item.brand?.name,
        price: pricePerMonth,
      },
      'Список номенклатур'
    )
  }

  const url = usePathname()

  return (
    <EntityCard
      className={`${styles.card} ${compact ? styles.cardCompact : ''} ${selected ? 'ring-2 ring-[#ef5350]' : ''} ${className}`.trim()}
      style={compact ? { height: 'auto' } : undefined}
      footer={
        <>
          <div>
            <div className={styles.priceLabel}>Стоимость</div>
            <div className={styles.price}>
              {pricePerMonth
                ? `${formatPrice(pricePerMonth)}/день`
                : 'По запросу'}
            </div>
          </div>
          {codeMP ? (
            <Link href={href} className={styles.selectButton}>
              Перейти в медиаплан
            </Link>
          ) : (
            <AddToCartButton
              item={item}
              addLabel="Выбрать"
              selectedLabel="В заказе"
              className={styles.selectButton}
            />
          )}
        </>
      }
      footerClassName={`${styles.footer} ${compact ? styles.footerCompact : ''}`.trim()}
    >
      <Link
        href={href}
        className={styles.cardLink}
        onClick={handleCardClick}
        onFocus={() => onSelect?.(item.id)}
      >
        <div className={styles.media}>
          {image ? (
            <Image
              src={image}
              alt={getNomenclatureTitle(item)}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1280px) 50vw, 420px"
              className={styles.image}
            />
          ) : (
            <div className={styles.imagePlaceholder}>{placeType}</div>
          )}
          <div className={styles.imageOverlay} />
          {brandLogo && (
            <span className={styles.brandBadge}>
              <Image
                src={brandLogo}
                alt={`Логотип ${item.brand?.name || 'бренда'}`}
                width={112}
                height={40}
                className={styles.brandLogo}
                loading="lazy"
              />
            </span>
          )}
        </div>

        <div className={styles.content}>
          {url.startsWith('/brands') ? (
            <h3 className={styles.title}>
              <MapPin size={18} aria-hidden="true" />
              <span>{address}</span>
            </h3>
          ) : (
            <>
              <h3 className={styles.title}>
                {getNomenclatureTitle(item, 'small')}
              </h3>
              <p className={styles.address}>
                <MapPin size={18} aria-hidden="true" />
                <span>{address}</span>
              </p>
            </>
          )}

          {/* <p className={styles.address}>
            <MapPin size={18} aria-hidden="true" />
            <span>{address}</span>
          </p> */}
        </div>
      </Link>
    </EntityCard>
  )
}
