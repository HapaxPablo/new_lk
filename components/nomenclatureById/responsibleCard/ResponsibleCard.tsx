import styles from './ResponsibleCard.module.scss'
import { ReactNode } from 'react'
import { Phone } from 'lucide-react'
import { EntityCard } from '@/components/ui/card/EntityCard'

interface Props {
  label: string
  icon: ReactNode
  name: string
  phoneNumber?: string[]
  color?: string
}

export function ResponsibleCard({
  label,
  icon,
  name,
  phoneNumber,
  color = '',
}: Props) {
  const formatPhoneHref = (phone: string) =>
    `tel:${phone.replace(/[^\d+]/g, '')}`

  return (
    <EntityCard className={`${styles.wrapper} ${color}`}>
      <div className={styles.wrapper__content}>
        <div>{name}</div>
        <header className={styles.wrapper__header}>
          {icon}
          <h3 className="font-medium">{label}</h3>
        </header>
      </div>
      {phoneNumber?.length ? (
        <div className={styles.phones}>
          {phoneNumber.map((phone, index) => (
            <a
              key={index}
              href={formatPhoneHref(phone)}
              className={styles.phones__phone}
            >
              <Phone size={16} />
              {phone}
            </a>
          ))}
        </div>
      ) : null}
    </EntityCard>
  )
}
