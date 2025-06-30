'use client'

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { encryptData } from '@/lib/crypto'

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await fetch('/api/auth/session', {
          // cache: 'no-store' // Отключаем кеширование нужно подумать отключать или нет
        })

        if (!res.ok) {
          throw new Error('Session check failed')
        }

        const data = await res.json()
        setUser(data.user)
      } catch (error) {
        console.error('Auth initialization error:', error)
        // Перенаправляем на login если не авторизован
        if (pathname !== '/login') {
          router.push('/login')
        }
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
        body: JSON.stringify({
          email,
          password: encryptData(password),
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Login failed')
      }

      const { user } = await res.json()
      setUser(user)
      router.push('/nomenclatures')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      setUser(null)
      router.push('/login')
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
      if (!res.ok) {
        throw new Error('Session refresh failed')
      }
      const data = await res.json()
      setUser(data.user)
    } catch (error) {
      console.error('Refresh session error:', error)
      // Можно добавить автоматический logout при ошибке:
      // await logout()
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, refreshSession }}
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
