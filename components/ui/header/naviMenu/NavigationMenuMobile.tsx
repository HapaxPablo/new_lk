'use client'

import { useId, useRef, useState } from 'react'
import styles from './NavigationMenu.module.scss'
import { NAV_ITEMS } from '@/lib/configs/configMenuHeader'
import { X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useDialogAccessibility } from '@/components/modal/useDialogAccessibility'

const NavigationMenuMobile = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const titleId = useId()

  const closeMenu = () => setIsOpen(false)

  useDialogAccessibility({
    isOpen,
    dialogRef: menuRef,
    onClose: closeMenu,
    initialFocusRef: closeButtonRef,
  })

  return (
    <>
      <div className={styles.menu_button_wrapper}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setIsOpen((value) => !value)}
          aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={menuId}
        >
          <Image
            className={styles.header__logo}
            src="/logo_mobile.svg"
            alt=""
            width={24}
            height={24}
            title="Логотип RMC"
          />
        </button>
      </div>

      {isOpen && (
        <>
          <button
            type="button"
            className={`${styles.menuOverlay} ${styles.open}`}
            onClick={closeMenu}
            aria-label="Закрыть меню"
          />
          <nav
            ref={menuRef}
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={`${styles.link_wrapper} ${styles.open}`}
          >
            <div className={styles.mobile_header}>
              <h2 id={titleId} className={styles.mobile_title}>
                Меню
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMenu}
                className={styles.close_button}
                aria-label="Закрыть меню"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeMenu}
                aria-current={pathname === item.path ? 'page' : undefined}
                className={`${styles.link_item} ${
                  pathname === item.path ? styles.active : ''
                }`}
              >
                <div className={styles.link_content}>
                  {item.icon && (
                    <div className={styles.icon_container}>
                      <item.icon size={20} aria-hidden="true" />
                    </div>
                  )}
                  <span className={styles.link_text}>{item.title}</span>
                </div>
              </Link>
            ))}
          </nav>
        </>
      )}
    </>
  )
}

export default NavigationMenuMobile
