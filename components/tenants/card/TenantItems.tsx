'use client'

import { CardTenant } from '@/components/ui/card/CardTenant'
import { IGroupedTenant } from '@/types/tenants'
import { useRouter } from 'next/navigation'
import styles from './TenantItems.module.scss'

interface TenantItemsProps {
  item: IGroupedTenant[]
  className?: string
}

export const TenantItems: React.FC<TenantItemsProps> = ({
  item,
  className = '',
}) => {
  const router = useRouter()

  const handleClickCard = (id: string) => {
    router.push(`/tenants/${id}`)
  }

  return (
    <div className={styles.cardGrid}>
      {item.map((tenant, key) => (
        <CardTenant
          key={`${tenant.brandId}-${key}`}
          className={className}
          item={tenant}
          onClick={() => handleClickCard(tenant.tenantId)}
        />
      ))}
    </div>
  )
}
