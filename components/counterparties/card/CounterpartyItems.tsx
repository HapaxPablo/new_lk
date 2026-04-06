import { CardCounterparty } from '@/components/ui/card/CardCounterparty'
import { ICounterparty } from '@/types/counterparty'
import { useRouter } from 'next/navigation'
import styles from './CounterpartyItem.module.scss'

interface CounterpartyCardProps {
  item: ICounterparty[]
  className?: string
}

export const CounterpartyItems: React.FC<CounterpartyCardProps> = ({
  item,
  className = '',
}) => {
  const router = useRouter()

  const handleClickCard = (id: string) => {
    router.push(`/counterparties/${id}`)
  }

  return (
    <div className={styles.cardGrid}>
      {item.map((counterparty, key) => (
        <CardCounterparty
          onClick={() => handleClickCard(counterparty.id)}
          key={key}
          className={`${className}`}
          item={counterparty}
        />
      ))}
    </div>
  )
}
