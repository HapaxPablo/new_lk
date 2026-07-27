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

function getHref(type: string, value: string) {
  switch (type) {
    case 'mail':
    case 'rab':
    case 'lich':
      return `mailto:${value}`
    case 'phone':
    case 'mobkl':
    case 'dop':
    case 'mobkldop':
      return `tel:${value.replace(/\s+/g, '')}`
    case 'web':
      return value.startsWith('http') ? value : `https://${value}`
    case 'messenger':
      return `${value}`
    case 'address':
      return `https://www.google.com/maps/search/${encodeURIComponent(value)}`
    default:
      return '#'
  }
}

export function ContactItem({ type, value, title }: ContactItemProps) {
  const icon = icons[type] ?? icons.other
  const href = getHref(type, value)

  return (
    <a
      href={href}
      title={title}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.contact}
    >
      {icon}
      <span>{value}</span>
    </a>
  )
}
