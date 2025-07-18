'use client'

import { useNotification } from '@/hooks/useNotification'
import { AuthResponse } from '@/types/auth'
import { useRouter } from 'next/navigation'
import { createContext, ReactNode, useContext, useState } from 'react'

type AuthContextType = {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => Promise<void>
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

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const response = await fetch('/api/auth/check', {
  //         credentials: 'include',
  //         // cache: 'no-store',
  //       })

  //       if (response.ok) {
  //         const result = await response.json()
  //         setIsAuthenticated(result.isAuthenticated)

  //         if (!result.isAuthenticated) {
  //           // await logout()
  //           console.log('сделать проверку токена в 1с');

  //         }
  //       } else {
  //         setIsAuthenticated(false)
  //       }
  //     } catch (err) {
  //       console.error('Auth check failed:', err)
  //       setIsAuthenticated(false)
  //     }
  //   }

  //   checkAuth()
  // }, [])

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
        credentials: 'include',
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

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        setIsAuthenticated(false)
        router.push('/login')
      } else {
        throw new Error('Ошибка при выходе')
      }
    } catch (err) {
      console.error('Logout failed:', err)
      showNotification('Ошибка при выходе из системы', 'error')
    }
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
