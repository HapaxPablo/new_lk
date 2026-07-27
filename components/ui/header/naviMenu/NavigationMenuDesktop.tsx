'use client'
import { NAV_ITEMS } from '@/lib/configs/configMenuHeader'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './NavigationMenu.module.scss'

const NavigationMenuDesktop = () => {
  const pathname = usePathname()
  return (
    <div className={styles.navigation_menu_wrapper}>
      <nav aria-label="Основное меню" className={styles.link_wrapper}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            title={item.title}
            className={`${styles.link_item} ${
              pathname === item.path ? styles.active : ''
            }`}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
export default NavigationMenuDesktop
