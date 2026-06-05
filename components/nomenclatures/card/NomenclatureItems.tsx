import { CardNomenclature } from '@/components/ui/card/CardNomenclature'
import { INomenclatureItem } from '@/types/nomenclature'
import styles from './NomenclatureItem.module.scss'

interface NomenclatureCardProps {
  item: INomenclatureItem[]
  className?: string
}

export const NomenclatureItems: React.FC<NomenclatureCardProps> = ({
  item,
  className = '',
}) => {
  return (
    <div className={styles.cardGrid}>
      {item.map((item, key) => (
        <CardNomenclature
          key={`${item.id} - ${key}`}
          className={`${className}`}
          item={item}
        />
      ))}
    </div>
  )
}
