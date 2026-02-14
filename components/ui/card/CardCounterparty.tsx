import { ICounterparty } from '@/types/counterparty'
import { Building, Hash, Calendar } from 'lucide-react'
import styles from './CardCounterparty.module.scss'
import { Button } from '../button/Button'
import { useUniversalClick } from '@/hooks/useUniversalClick'
import { InfoRow } from '../InfoRow'

interface CardCounterpartyProps {
  className?: string
  onClick?: () => void
  item: ICounterparty
}

export const CardCounterparty: React.FC<CardCounterpartyProps> = ({
  item,
  className = '',
  onClick,
}) => {
  const handleUniversalClick = useUniversalClick()

  // Форматирование даты создания
  const formattedDate = item.created
    ? new Date(item.created).toLocaleDateString()
    : '—'

  return (
    <article className={`${styles.card} ${className}`} onClick={onClick}>
      <div className={styles.cardContent}>
        <div className={styles.infoSection}>
          <div className={styles.headerRow}>
            <span
              className={`${styles.statusBadge} ${item.is_deleted ? styles.inactive : styles.active}`}
            >
              {item.is_deleted ? 'Удалён' : 'Активен'}
            </span>
          </div>

          <InfoRow
            icon={<Building size={16} />}
            label=""
            value={item.name ? item.name : '-'}
            valueClassName={styles.nameText}
          />

          <InfoRow
            icon={<Hash size={16} />}
            label=""
            value={`1С: ${item.code1c ? item.code1c : '-'}`}
            valueClassName={styles.codeText}
          />

          <InfoRow
            icon={<Calendar size={16} />}
            label="Создан:"
            value={formattedDate}
            valueClassName={styles.secondaryText}
          />
        </div>
      </div>

      <div className={styles.actionsSection}>
        <Button
          className={styles.button}
          variant="detail"
          onClick={(e) => handleUniversalClick(onClick, e)}
        >
          Подробнее
        </Button>
      </div>
    </article>
  )
}
