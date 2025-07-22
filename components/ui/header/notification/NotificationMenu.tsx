'use client'

import { useModal } from '@/providers/modal/ModalProvider'
import styles from './NotificationMenu.module.scss'
import { BellDot } from 'lucide-react'

const NotificationMenu = () => {
  const { openModal } = useModal('notifications')

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    openModal()
  }

  return (
    <button
      onClick={handleClick}
      className={styles.notificationMenu}
      aria-label="Показать уведомления"
    >
      <BellDot
        size={24}
        aria-hidden="false"
        className={styles.notificationMenu__icon}
      />
    </button>
  )
}

export default NotificationMenu
