'use client'

import Image from 'next/image'
import { MapPin, MapPinHouse, RussianRuble } from 'lucide-react'
import styles from './CardNomenclature.module.scss'
import { formatPrice } from '@/utils'
import { useUniversalClick } from '@/hooks/useUniversalClick'
import { Button } from '../button/Button'
import { useNomenclatureStore } from '@/store/useNomenclatureStore'

interface CardNomenclatureProps {
  className?: string
  onClick?: () => void
  item: any
  codeMP?: string | null
}

export const CardNomenclature: React.FC<CardNomenclatureProps> = ({
  item,
  className = '',
  onClick,
  codeMP = null, //TODO вынести из пропсов, взять в Item и изменить логику использования
}) => {
  const { brand, exterior, typeOfPlace, pricePerMonth, brandName } = item
  // Получаем первое изображение для превью
  const mainImage = exterior?.[0]?.source || exterior
  const logoSrc = brand?.logotype
  const { ids, toggle } = useNomenclatureStore()

  const handleUniversalClick = useUniversalClick()

  // Обработчик для кнопки "Добавить"
  const isSelected = ids.includes(item.id)

  const handleAdd = () => toggle(item)

  // Обработчик для кнопки "Медиаплан"
  const handleMediaPlan = () => {
    console.log('MediaPlane button clicked  for item:', item.id)
  }

  // Форматирование цены
  const formattedPrice = pricePerMonth
    ? `от ${formatPrice(pricePerMonth)}/день`
    : 'Цена не указана'

  // Форматирование адреса
  const formattedAddress =
    typeof item.formattedAddress === 'string'
      ? item.formattedAddress
      : item.formattedAddress?.name ?? 'Адрес не указан'



  return (
    <article className={`${styles.card} ${className}`} onClick={onClick}>
      <div className={styles.cardContent}>
        <div className={styles.mediaSection}>
          <div className={styles.imageWrapper}>
            {mainImage ? (
              <Image
                src={mainImage}
                alt={`Фасад ${brand?.name || 'места'}`}
                fill

                className={styles.image}
                sizes="80px"
                loading="lazy"
              />
            ) : logoSrc ? (
              <Image
                src={logoSrc}
                alt={`Логотип ${brand?.name}`}
                fill
                className={styles.image}
                sizes="80px"
                loading="lazy"

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

              />{' '}
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <MapPinHouse className={styles.icon} size={16} />
            <div className={styles.textContent}>
              <span className={styles.primaryText}>
                {typeOfPlace || 'Тип не указан'}
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

      <div className={styles.actionsSection}>
        <Button
          className={styles.button}
          variant="detail"
          onClick={(e) => handleUniversalClick(onClick, e)}
        >
          Подробнее
        </Button>

        {codeMP ? (
          <Button
            className={styles.button}
            variant="navigate"
            onClick={(e) => handleUniversalClick(handleMediaPlan, e)}
          >
            Перейти в медиаплан
          </Button>
        ) : (
          <Button
            className={styles.button}
            variant="add"
            onClick={(e) => handleUniversalClick(handleAdd, e)}
            isActive={isSelected}
          // disabled={isSelected}
          >
            {isSelected ? 'Убрать из заказа' : 'Разместить ролик'}
          </Button>
        )}
      </div>
    </article>
  )
}
