import { ICounterparty } from '@/types/counterparty'
import { Building, Hash, Calendar } from 'lucide-react'
import styles from './CardCounterparty.module.scss'
import { LinkButton } from '../button/LinkButton'
import { InfoRow } from '../InfoRow'
import Link from 'next/link'

interface CardCounterpartyProps {
  className?: string
  item: ICounterparty
}

export const CardCounterparty: React.FC<CardCounterpartyProps> = ({
  item,
  className = '',
}) => {
  const formattedDate = item.created
    ? new Date(item.created).toLocaleDateString()
    : '—'

  return (
    <article className={`${styles.card} ${className}`}>
      <Link href={`/counterparties/${item.id}`} className={styles.cardLink}>
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
      </Link>

      <div className={styles.actionsSection}>
        <LinkButton href={`/counterparties/${item.id}`} variant="default">
          Подробнее
        </LinkButton>
      </div>
    </article>
  )
}
