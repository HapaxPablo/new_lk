import { IBrandListItem } from '@/types/brands'
import { Building } from 'lucide-react'
import styles from './CardBrand.module.scss'
import Image from 'next/image'
import { InfoRow } from '../InfoRow'
import { LinkButton } from '../button/LinkButton'
import Link from 'next/link'

interface CardBrandProps {
  className?: string
  item: IBrandListItem
}

export const CardBrand: React.FC<CardBrandProps> = ({
  item,
  className = '',
}) => {
  return (
    <article className={`${styles.card} ${className}`}>
      <Link href={`/brands/${item.slug}`} className={styles.cardLink}>
        <div className={styles.cardContent}>
          <div className={styles.infoSection}>
            <div className={styles.imageWrapper}>
              {item.logotype ? (
                <Image
                  src={item.logotype}
                  alt={`Бренд ${item.name || 'Бренд'}`}
                  fill
                  loading="lazy"
                  className={styles.image}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <Image
                    src="/og-logo.jpg"
                    alt="Логотип"
                    width={200}
                    height={100}
                    loading="lazy"
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            <InfoRow
              icon={<Building size={16} />}
              label=""
              value={item.name ? item.name : '-'}
              valueClassName={styles.nameText}
            />
          </div>
        </div>
      </Link>

      <div className={styles.actionsSection}>
        <LinkButton href={`/brands/${item.slug}`} variant="default">
          Подробнее
        </LinkButton>
      </div>
    </article>
  )
}
