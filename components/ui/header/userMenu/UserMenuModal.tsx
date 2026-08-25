'use client'

import { useId, useRef } from 'react'
import { User, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDialogAccessibility } from '@/components/modal/useDialogAccessibility'
import styles from './UserMenu.module.scss'

interface IUserMenuModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  userRole: string
  onLogout: () => void
}

const UserMenuModal = ({
  isOpen,
  onClose,
  userName,
  userRole,
  onLogout,
}: IUserMenuModalProps) => {
  const router = useRouter()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useDialogAccessibility({
    isOpen,
    dialogRef,
    onClose,
    initialFocusRef: closeButtonRef,
  })

  const handleSettingsClick = () => {
    onClose()
    router.push('/settings')
  }

  if (!isOpen) return null

  return (
    <>
      <button
        type="button"
        className={styles.modalBackdrop}
        onClick={onClose}
        aria-label="Закрыть меню пользователя"
      />
      <div
        ref={dialogRef}
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Закрыть меню пользователя"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <h2 id={titleId} className={styles.visuallyHidden}>
          Меню пользователя
        </h2>
        <div className={styles.userModal__header}>
          <User aria-hidden="true" size={24} />
          <div>
            <p>{userName}</p>
            {userRole && <span className={styles.userModal__role}>{userRole}</span>}
          </div>
        </div>
        <nav aria-label="Пользовательское меню">
          <ul className={styles.userModal__menu}>
            <li>
              <button
                type="button"
                onClick={handleSettingsClick}
                className={styles.userModal__item}
              >
                Настройки
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onLogout}
                className={styles.userModal__item}
              >
                Выйти
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}

export default UserMenuModal
