'use client'

import { useNotification } from '@/hooks/useNotification'
import { AuthResponse } from '@/types/auth'
import { useRouter } from 'next/navigation'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

type AuthContextType = {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => void
  error: string | null
  blockTime: number | null
}

type LoginResponse = {
  success: boolean
  message?: string
  blockTime?: number
  data?: AuthResponse
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [blockTime, setBlockTime] = useState<number | null>(null)
  const router = useRouter()

  const { showNotification } = useNotification()
  console.log(isAuthenticated)

  useEffect(() => {
    // Проверяем аутентификацию при загрузке (например, по наличию токена в cookies)
    const checkAuth = async () => {
      // Здесь добавлю проверку токена
      // const token = getCookie('xrmcCookie')
      // setIsAuthenticated(!!token)
    }
    checkAuth()
  }, [])

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка авторизации')
      }

      if (data.isAuthorized) {
        setIsAuthenticated(true)
        setError(null)
        setBlockTime(null)
        router.push('/nomenclatures')
        return {
          success: true,
          data,
        }
      } else if (!data.isAuthorized && !data.emailIsExit) {
        showNotification(`${data.message}`, 'error')
        router.push('/registration')
        return { success: false }
      } else {
        if (data.timeout) {
          setBlockTime(data.timeout)
          setError(data.message || 'Ошибка авторизации')
          return {
            success: false,
            message: `Аккаунт заблокирован до ${new Date(data.timeout * 1000).toLocaleTimeString()}`,
            blockTime: data.timeout,
            data,
          }
        }
        setError(data.message || 'Ошибка авторизации')
        return {
          success: false,
          message: data.message,
          data,
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка'
      setError(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    // Здесь добавлю вызов API для выхода
    setIsAuthenticated(false)
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, error, blockTime }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
