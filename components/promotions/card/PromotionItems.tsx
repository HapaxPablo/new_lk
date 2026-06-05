import { CardPromotion } from '@/components/ui/card/CardPromotion'
import { IPromotionList } from '@/types/promotion'
import styles from './PromotionItems.module.scss'

interface PromotionCardProps {
  item: IPromotionList[]
  className?: string
}

export const PromotionItems: React.FC<PromotionCardProps> = ({
  item,
  className = '',
}) => {
  return (
    <div className={styles.cardGrid}>
      {item.map((promotion, key) => (
        <CardPromotion
          key={key}
          className={`${className}`}
          item={promotion}
        />
      ))}
    </div>
  )
}
