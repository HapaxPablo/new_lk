'use client'
import { useState } from 'react'
import styles from './NavigationMenu.module.scss'
import { NAV_ITEMS } from '@/lib/configs/configMenuHeader'
import { X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const NavigationMenuMobile = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const toggleMenu = () => setIsOpen(!isOpen)
  const currentItem = NAV_ITEMS.find((item) => item.path === pathname)


  return (
    <>
      <div className={styles.menu_button_wrapper}>
        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          <Image
            className={styles.header__logo}
            src="/logo_mobile.svg"
            alt="logo"
            width={24}
            height={24}
            priority
            title="логотип-rmc"
            aria-label="logo"
          />
        </button>
        {/* <span className={styles.menu_button_description}>
          {currentItem?.title}
        </span> */}
      </div>
      <div
        className={`${styles.menuOverlay} ${isOpen ? styles.open : ''}`}
        onClick={toggleMenu}
      />

      <nav
        aria-label="Основное меню"
        className={`${styles.link_wrapper} ${isOpen ? styles.open : ''}`}
      >
        {isOpen && (
          <div className={styles.mobile_header}>
            <span className={styles.mobile_title}>Меню</span>
            <button
              onClick={toggleMenu}
              className={styles.close_button}
              aria-label="Закрыть меню"
            >
              <X size={24} />
            </button>
          </div>
        )}
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={toggleMenu}
            className={`${styles.link_item} ${pathname === item.path ? styles.active : ''
              }`}
          >
            <div className={styles.link_content}>
              {item.icon && (
                <div className={styles.icon_container}>
                  <item.icon size={20} />
                </div>
              )}
              <span className={styles.link_text}>{item.title}</span>
            </div>
          </Link>
        ))}
      </nav>
    </>
  )
}
export default NavigationMenuMobile
