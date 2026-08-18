'use client'

import { useToast } from '@/hooks/useToast'
import { AuthResponse } from '@/types/auth'
import { ICurrentUser, isEmployeeRole } from '@/types/user'
import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

type AuthContextType = {
  isAuthenticated: boolean
  isEmployee: boolean
  isLoading: boolean
  user: ICurrentUser | null
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => Promise<void>
  refreshUser: () => Promise<ICurrentUser | null>
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
  const [isEmployee, setIsEmployee] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<ICurrentUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [blockTime, setBlockTime] = useState<number | null>(null)
  const router = useRouter()
  const url = usePathname()
  const { showToast } = useToast()
  const refreshUser = useCallback(async (): Promise<ICurrentUser | null> => {
    const response = await fetch('/api/auth/users/me', {
      credentials: 'include',
      cache: 'no-store',
    })

    if (!response.ok) {
      setUser(null)
      setIsEmployee(false)
      return null
    }

    const currentUser: ICurrentUser = await response.json()
    setUser(currentUser)
    setIsEmployee(isEmployeeRole(currentUser.role))
    return currentUser
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'POST',
          credentials: 'include',
          // cache: 'no-store',
        })

        if (response.ok) {
          const result = await response.json()
          setIsAuthenticated(result.isAuthenticated)
          if (result.isAuthenticated) {
            await refreshUser()
          } else {
            setUser(null)
            setIsEmployee(false)
          }
          // if (!result.isAuthenticated && url !== '/nomenclatures') {
          //   await logout()
          //   // console.log('сделать проверку токена в 1с');
          // }
        } else {
          setIsAuthenticated(false)
          setUser(null)
          setIsEmployee(false)
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        setIsAuthenticated(false)
        setUser(null)
        setIsEmployee(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [refreshUser])

  const login = async (email: string, password: string): Promise<any> => {
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
        // throw new Error(data.message || 'Ошибка авторизации')
        throw new Error('Ошибка авторизации')
      }

      if (data.access) {
        setIsAuthenticated(true)
        await refreshUser()
        setError(null)
        setBlockTime(null)
        if (url === '/order') {
          return
        }
        if (typeof window !== 'undefined') {
          window.location.href = '/nomenclatures?page=1&limit=24'
        } else {
          router.push('/nomenclatures?page=1&limit=24')
        }

        return {
          success: true,
          data,
        }
      } else if (!data.access) {
        // showToast(`${data.message}`, 'error')
        showToast(`err`, 'error')

        // router.push('/registration')
        return { success: false }
      }
      // else {
      //   if (data.timeout) {
      //     setBlockTime(data.timeout)
      //     setError(data.message || 'Ошибка авторизации')
      //     return {
      //       success: false,
      //       message: `Аккаунт заблокирован до ${new Date(data.timeout * 1000).toLocaleTimeString()}`,
      //       blockTime: data.timeout,
      //       data,
      //     }
      //   }
      //   setError(data.message || 'Ошибка авторизации')
      //   return {
      //     success: false,
      //     message: data.message,
      //     data,
      //   }
      // }
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
        setIsEmployee(false)
        setUser(null)
        // router.push('/login')
      } else {
        throw new Error('Ошибка при выходе')
      }
    } catch (err) {
      console.error('Logout failed:', err)
      showToast('Ошибка при выходе из системы', 'error')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isEmployee,
        isLoading,
        user,
        login,
        logout,
        refreshUser,
        error,
        blockTime,
      }}
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
