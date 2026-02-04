import { Mail, Phone } from 'lucide-react'
import styles from './ContactItem.module.scss'
import { JSX } from 'react'

type ContactType = any

interface ContactItemProps {
  type: ContactType
  value: string
  meta?: string
}

const icons: Record<ContactType, JSX.Element> = {
  mail: <Mail size={16} />,
  phone: <Phone size={16} />,
}

export function ContactItem({ type, value, meta }: ContactItemProps) {
  return (
    <div className={styles.contact}>
      {icons[type]}
      <span>
        {value}
        {meta && ` (${meta})`}
      </span>
    </div>
  )
}
