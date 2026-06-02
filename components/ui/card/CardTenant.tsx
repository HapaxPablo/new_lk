'use client'

import { IGroupedTenant } from '@/types/tenants'
import { Building2, Hash, MapPinned } from 'lucide-react'
import { InfoRow } from '../InfoRow'
import styles from './CardTenant.module.scss'
import Image from 'next/image'
import { LinkButton } from '../button/LinkButton'

interface CardTenantProps {
  className?: string
  item: IGroupedTenant
  onClick?: () => void
}

export const CardTenant: React.FC<CardTenantProps> = ({
  item,
  className = '',
  onClick,
}) => {
  return (
    <article
      className={`${styles.card} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (!onClick) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
    >

      <div className={styles.headerRow}>
        <InfoRow
          // icon={<Building2 size={16} />}
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
        <LinkButton href={`tenants/${item.tenantId}`} variant="default">
          Подробнее
        </LinkButton>
        {/* TODO: LinkButton подробнее href=tenants/{id} */}
      </div>
    </article>
  )
}
