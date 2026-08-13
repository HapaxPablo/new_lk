import Image from 'next/image'
import Link from 'next/link'
import { IBrandListItem } from '@/types/brands'
import { EntityCard } from './EntityCard'
import styles from './CardBrand.module.scss'

interface CardBrandProps {
  className?: string
  item: IBrandListItem
}

export const CardBrand: React.FC<CardBrandProps> = ({
  item,
  className = '',
}) => {
  const href = `/brands/${item.slug}`

  return (
    <EntityCard
      className={`${styles.card} ${className}`.trim()}
      footer={
        <>
          {/* <div>
            <div className={styles.footerLabel}>Каталог</div>
            <div className={styles.footerValue}>Площадки</div>
          </div> */}
          <Link href={href} className={styles.detailButton}>
            Подробнее
          </Link>
        </>
      }
      footerClassName={styles.footer}
    >
      <Link href={href} className={styles.cardLink}>
        <div className={styles.media}>
          {item.logotype ? (
            <Image
              src={item.logotype}
              alt={`Логотип ${item.name || 'бренда'}`}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1280px) 50vw, 320px"
              className={styles.image}
              loading="lazy"
            />
          ) : (
            <span className={styles.imagePlaceholder}>
              {item.name || 'Бренд'}
            </span>
          )}
          <div className={styles.imageOverlay} />
          <span className={styles.badge}>Бренд</span>
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{item.name || 'Бренд'}</h3>
          <p className={styles.description}>
            Доступные площадки и адреса для размещения рекламы.
          </p>
        </div>
      </Link>
    </EntityCard>
  )
}
