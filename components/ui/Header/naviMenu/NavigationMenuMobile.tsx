'use client'
import { useState } from 'react'
import styles from './NavigationMenu.module.scss'
import { NAV_ITEMS } from '@/lib/configs/configMenuHeader'
import { X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import MenuIcon from './MenuIcon'

const NavigationMenuMobile = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      <button
        className={styles.menuButton}
        onClick={toggleMenu}
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
      >
        {isOpen ? <X size={24} /> : <MenuIcon />}
      </button>

      {/* Оверлей */}
      <div
        className={`${styles.menuOverlay} ${isOpen ? styles.open : ''}`}
        onClick={toggleMenu}
      />
      <nav
        aria-label="Основное меню"
        className={`${styles.link_wrapper} ${isOpen ? styles.open : ''}`}
      >
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
    </>
  )
}
export default NavigationMenuMobile
