import {
  MapPin,
  Star,
  Film,
  Calendar,
  Tag,
  CheckSquare,
  Users,
  Info,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  title: string
  path: string
  icon?: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Места для рекламы',
    path: '/nomenclatures',
    icon: MapPin,
  },
  {
    title: 'О нас',
    path: '/about',
    icon: Info,
  },
  // {
  //   title: 'Мои места',
  //   path: '/my-place',
  //   icon: Star,
  // },
  // {
  //   title: 'Ролики',
  //   path: '/content',
  //   icon: Film,
  // },
  // {
  //   title: 'Медиапланы',
  //   path: '/media-plans',
  //   icon: Calendar,
  // },
  // {
  //   title: 'Акции',
  //   path: '/promotions',
  //   icon: Tag,
  // },
  // {
  //   title: 'Задачи',
  //   path: '/tasks',
  //   icon: CheckSquare,
  // },
  // {
  //   title: 'Контрагенты',
  //   path: '/counterparties',
  //   icon: Users,
  // },
]
