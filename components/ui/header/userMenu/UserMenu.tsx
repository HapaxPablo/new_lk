'use client'
import { useAuth } from '@/providers/auth-provider/AuthProvider'
import { getUserFullName, USER_ROLE_LABELS } from '@/types/user'
import { LogIn, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './UserMenu.module.scss'
import UserMenuModal from './UserMenuModal'
const UserMenu = () => {
  const router = useRouter()
  const { isAuthenticated, logout, user } = useAuth()
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false)

  const userName = user ? getUserFullName(user) : 'Пользователь'
  const userRole = user ? USER_ROLE_LABELS[user.role] || user.role : ''

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
            {userName}
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
          userName={userName}
          userRole={userRole}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}
export default UserMenu
