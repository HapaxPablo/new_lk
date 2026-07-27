import { Button } from '@/components/ui/button/Button'
import styles from './CostCard.module.scss'
import { formatPrice } from '@/utils/nomenclatureUtils'

type CostCardProps = {
  cost: string
}

export const CostCard = ({ cost }: CostCardProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__header}>
        <span>Стоимость размещения</span>
        <span className={styles.wrapper__header__cost}>
          {formatPrice(cost)}/день
        </span>
        <span>при размещении от 1 месяца</span>
      </div>
      <div className={styles.wrapper__footer}>
        <Button variant="success">Добавить в медиаплан</Button>
      </div>
    </div>
  )
}
