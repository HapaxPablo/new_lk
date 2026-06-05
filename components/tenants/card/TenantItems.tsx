import { CardTenant } from '@/components/ui/card/CardTenant'
import { IGroupedTenant } from '@/types/tenants'
import styles from './TenantItems.module.scss'

interface TenantItemsProps {
  item: IGroupedTenant[]
  className?: string
}

export const TenantItems: React.FC<TenantItemsProps> = ({
  item,
  className = '',
}) => {
  return (
    <div className={styles.cardGrid}>
      {item.map((tenant, key) => (
        <CardTenant
          key={`${tenant.brandId}-${key}`}
          className={className}
          item={tenant}
        />
      ))}
    </div>
  )
}
