import { IPromotionList } from '@/types/promotion'
import { Tag, Calendar, Hash, Users } from 'lucide-react'
import styles from './CardPromotion.module.scss'
import { Button } from '../button/Button'
import { useUniversalClick } from '@/hooks/useUniversalClick'
import { InfoRow } from '../InfoRow'

interface CardPromotionProps {
  className?: string
  onClick?: () => void
  item: IPromotionList
}

export const CardPromotion: React.FC<CardPromotionProps> = ({
  item,
  className = '',
  onClick,
}) => {
  const handleUniversalClick = useUniversalClick()

  // Форматирование даты создания
  const formattedDate = item.created
    ? new Date(item.created).toLocaleDateString()
    : '—'

  // Форматирование периода акции
  const formatPeriod = () => {
    if (!item.start_period && !item.end_period) return 'Бессрочно'

    const start = item.start_period
      ? new Date(item.start_period).toLocaleDateString()
      : ''
    const end = item.end_period
      ? new Date(item.end_period).toLocaleDateString()
      : ''

    if (start && end) return `${start} - ${end}`
    if (start) return `С ${start}`
    if (end) return `До ${end}`
    return '—'
  }

  return (
    <article className={`${styles.card} ${className}`} onClick={onClick}>
      <div className={styles.cardContent}>
        <div className={styles.infoSection}>
          <div className={styles.headerRow}>
            <span
              className={`${styles.statusBadge} ${item.is_active ? styles.active : styles.inactive}`}
            >
              {item.is_active ? 'Активна' : 'Неактивна'}
            </span>
          </div>

          <InfoRow
            icon={<Tag size={16} />}
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
            label="Период:"
            value={formatPeriod()}
            valueClassName={styles.periodText}
          />

          <InfoRow
            icon={<Calendar size={16} />}
            label="Создан:"
            value={formattedDate}
            valueClassName={styles.secondaryText}
          />

          {item.description && (
            <InfoRow
              icon={<Tag size={16} />}
              label="Описание:"
              value={item.description}
              valueClassName={styles.descriptionText}
            />
          )}
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
