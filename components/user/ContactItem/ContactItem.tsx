import {
  Globe,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Plane,
} from 'lucide-react'
import styles from './ContactItem.module.scss'
import { JSX } from 'react'

interface ContactItemProps {
  type: string
  value: string
  meta?: string
  title: string
}

const icons: Record<string, JSX.Element> = {
  mail: <Mail size={16} />,
  phone: <Phone size={16} />,
  address: <Plane size={16} />,
  web: <Globe size={16} />,
  messenger: <MessageCircle size={16} />,
  other: <HelpCircle size={16} />,
  mobkl: <Phone size={16} />,
  dop: <Phone size={16} />,
  mobkldop: <Phone size={16} />,
  rab: <Mail size={16} />,
  lich: <Mail size={16} />,
}

export function ContactItem({ type, value, meta, title }: ContactItemProps) {
  const icon = icons[type] ?? icons.other

  return (
    <div className={styles.contact}>
      {icon}
      <span title={title}>
        {value}
        {meta && ` (${meta})`}
      </span>
    </div>
  )
}
