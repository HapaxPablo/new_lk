'use client'

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'

type User =
  | {
      id: string
      name: string
      email: string
    }
  | null
  | 'guest' // Добавляем явное состояние "гость"

type AuthContextType = {
  user: User
  isLoading: boolean
  isGuest: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Явно вычисляемое свойство для проверки гостя
  const isGuest = user === 'guest'

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await fetch('/api/auth/session')

        if (!res.ok) {
          // Если сессии нет - устанавливаем статус гостя
          setUser('guest')
          return
        }

        const data = await res.json()
        setUser(data.user || 'guest')
      } catch (error) {
        console.error('Auth initialization error:', error)
        // Устанавливаем статус гостя при ошибке
        setUser('guest')

        // Не перенаправляем автоматически на login
        // Оставьте это на усмотрение конкретных страниц
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [pathname])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error(await res.text())

      const { user } = await res.json()
      setUser(user || 'guest')
      router.push('/nomenclatures')
    } catch (error) {
      console.error('Login error:', error)
      setUser('guest')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser('guest')
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const refreshSession = async () => {
    try {
      const res = await fetch('/api/auth/session')
      setUser(res.ok ? (await res.json()).user : 'guest')
    } catch (error) {
      console.error('Refresh session error:', error)
      setUser('guest')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isGuest,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
