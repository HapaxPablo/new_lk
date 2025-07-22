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
      <div className={styles.menu_button_wrapper}>
        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          <MenuIcon />
        </button>
        <span className={styles.menu_button_description}>
          {NAV_ITEMS.map((item) => (item.path === pathname ? item.title : ''))}
        </span>
      </div>
      {/* Оверлей */}
      <div
        className={`${styles.menuOverlay} ${isOpen ? styles.open : ''}`}
        onClick={toggleMenu}
      />
      <nav
        aria-label="Основное меню"
        className={`${styles.link_wrapper} ${isOpen ? styles.open : ''}`}
      >
        {isOpen && (
          <span onClick={toggleMenu} className={styles.wrapper_close_button}>
            <X size={36} />
          </span>
        )}
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
