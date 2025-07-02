'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [blockTime, setBlockTime] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Проверяем аутентификацию при загрузке (например, по наличию токена в cookies)
    const checkAuth = async () => {
      // Здесь добавлю проверку токена
      // const token = getCookie('xrmccookie')
      // setIsAuthenticated(!!token)
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка авторизации')
      }

      if (data.result) {
        setIsAuthenticated(true)
        setError(null)
        setBlockTime(null)
        router.push('/nomenclatures')
        return { success: true }
      } else {
        if (data.timeout) {
          setBlockTime(data.timeout)
          return { 
            success: false, 
            message: `Аккаунт заблокирован до ${new Date(data.timeout * 1000).toLocaleTimeString()}`, 
            blockTime: data.timeout 
          }
        }
        setError(data.message || 'Ошибка авторизации')
        return { success: false, message: data.message }
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
    <AuthContext.Provider value={{ isAuthenticated, login, logout, error, blockTime }}>
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