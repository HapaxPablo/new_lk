import { CardCounterparty } from '@/components/ui/card/CardCounterparty'
import { ICounterparty } from '@/types/counterparty'
import styles from './CounterpartyItem.module.scss'

interface CounterpartyCardProps {
  item: ICounterparty[]
  className?: string
}

export const CounterpartyItems: React.FC<CounterpartyCardProps> = ({
  item,
  className = '',
}) => {
  return (
    <div className={styles.cardGrid}>
      {item.map((counterparty, key) => (
        <CardCounterparty
          key={key}
          className={`${className}`}
          item={counterparty}
        />
      ))}
    </div>
  )
}
