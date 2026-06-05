import { IGroupedTenant } from '@/types/tenants'
import { InfoRow } from '../InfoRow'
import styles from './CardTenant.module.scss'
import Image from 'next/image'
import { LinkButton } from '../button/LinkButton'
import Link from 'next/link'

interface CardTenantProps {
  className?: string
  item: IGroupedTenant
}

export const CardTenant: React.FC<CardTenantProps> = ({
  item,
  className = '',
}) => {
  return (
    <article className={`${styles.card} ${className}`}>
      <Link href={`/tenants/${item.tenantId}`} className={styles.cardLink}>
        <div className={styles.headerRow}>
          <InfoRow
            label=""
            value={item.brandName || '-'}
            valueClassName={styles.nameText}
          />
          <span className={styles.countBadge}>{item.count}</span>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.imageWrapper}>
            {item.brandLogotype ? (
              <Image
                src={item.brandLogotype}
                alt={`Бренд ${item.brandName || 'Арендатор'}`}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                priority
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
        </div>
      </Link>

      <div className={styles.actionsSection}>
        <LinkButton href={`/tenants/${item.tenantId}`} variant="default">
          Подробнее
        </LinkButton>
      </div>
    </article>
  )
}
