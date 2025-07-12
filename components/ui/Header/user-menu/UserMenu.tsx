'use client'
import { useAuth } from '@/providers/auth-provider/AuthProvider'
import { LogIn, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './UserMenu.module.scss'
import UserMenuModal from './UserMenuModal'
const UserMenu = () => {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false)

  const userData = { name: 'Иван Иванов' } // Заменить на реальные данные из ответа к БД

  const handleUserClick = () => {
    if (isAuthenticated) {
      setIsUserModalOpen(true)
    } else {
      router.push('/login')
    }
  }
  const handleLogout = () => {
    logout()
    setIsUserModalOpen(false)
  }
  return (
    <div className={styles.user_container}>
      {isAuthenticated ? (
        <button
          onClick={handleUserClick}
          className={styles.user}
          aria-label="Личный кабинет"
          aria-haspopup="dialog"
          aria-expanded={isUserModalOpen}
          title="Личный кабинет"
        >
          <User className={styles.user__icon} size={24} aria-hidden="true" />
          <span className={styles.user__name} aria-hidden="false">
            {userData.name}
          </span>
        </button>
      ) : (
        <a
          href="/login"
          className={styles.login}
          aria-label="Войти в личный кабинет"
          title="Войти"
        >
          <LogIn className={styles.login__icon} size={24} aria-hidden="true" />
        </a>
      )}{' '}
      {isAuthenticated && (
        <UserMenuModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          userName={userData.name}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}
export default UserMenu
