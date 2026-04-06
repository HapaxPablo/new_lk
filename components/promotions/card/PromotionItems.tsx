import { CardPromotion } from '@/components/ui/card/CardPromotion'
import { IPromotionList } from '@/types/promotion'
import { useRouter } from 'next/navigation'
import styles from './PromotionItems.module.scss'

interface PromotionCardProps {
  item: IPromotionList[]
  className?: string
}

export const PromotionItems: React.FC<PromotionCardProps> = ({
  item,
  className = '',
}) => {
  const router = useRouter()

  const handleClickCard = (id: string) => {
    router.push(`/promotions/${id}`)
  }

  return (
    <div className={styles.cardGrid}>
      {item.map((promotion, key) => (
        <CardPromotion
          onClick={() => handleClickCard(promotion.id)}
          key={key}
          className={`${className}`}
          item={promotion}
        />
      ))}
    </div>
  )
}
