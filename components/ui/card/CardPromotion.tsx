import { IPromotionList } from '@/types/promotion'
import { Tag, Calendar, Hash } from 'lucide-react'
import styles from './CardPromotion.module.scss'
import { LinkButton } from '../button/LinkButton'
import { InfoRow } from '../InfoRow'
import Link from 'next/link'

interface CardPromotionProps {
  className?: string
  item: IPromotionList
}

export const CardPromotion: React.FC<CardPromotionProps> = ({
  item,
  className = '',
}) => {
  const formattedDate = item.created
    ? new Date(item.created).toLocaleDateString()
    : '—'

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
    <article className={`${styles.card} ${className}`}>
      <Link href={`/promotions/${item.id}`} className={styles.cardLink}>
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
      </Link>

      <div className={styles.actionsSection}>
        <LinkButton href={`/promotions/${item.id}`} variant="default">
          Подробнее
        </LinkButton>
      </div>
    </article>
  )
}
