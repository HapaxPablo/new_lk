'use client'
import { useRef, useEffect } from 'react'
import { User, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import styles from './UserMenu.module.scss'

interface IUserMenuModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  onLogout: () => void
}

const UserMenuModal = ({
  isOpen,
  onClose,
  userName,
  onLogout,
}: IUserMenuModalProps) => {
  const router = useRouter()
  const modalRef = useRef<HTMLDivElement>(null)

  // Закрытие по ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Закрытие по клику вне модалки
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      className={styles.modalBackdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-modal-title"
    >
      <div className={styles.modalContent}>
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Закрыть модальное окно"
        >
          <X size={20} />
        </button>
        <h2 id="user-modal-title" className="visually-hidden">
          Меню пользователя
        </h2>
        <div className={styles.userModal__header}>
          <User aria-hidden="true" size={24} />
          <p>{userName}</p>
        </div>
        <nav aria-label="Пользовательское меню">
          <ul className={styles.userModal__menu} role="menu">
            <li role="none">
              <button
                onClick={() => router.push('/settings')}
                className={styles.userModal__item}
                role="menuitem"
              >
                Настройки
              </button>
            </li>
            <li role="none">
              <button
                onClick={onLogout}
                className={styles.userModal__item}
                role="menuitem"
              >
                Выйти
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default UserMenuModal
