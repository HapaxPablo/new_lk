'use client'

import { authSchema, AuthSchema } from '@/lib/schems/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/providers/auth-provider/auth-provider'
import { useEffect, useState } from 'react'
import { formatTime } from '@/lib/utils'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  })

  const { login, error: authError, blockTime } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState<string | null>(null)

  useEffect(() => {
    if (blockTime) {
      const interval = setInterval(() => {
        const now = Math.floor(Date.now() / 1000)
        if (now >= blockTime) {
          setCountdown(null)
          clearInterval(interval)
        } else {
          setCountdown(formatTime(blockTime - now))
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [blockTime])

  const onSubmit = async (data: AuthSchema) => {
    setIsLoading(true)
    await login(data.email, data.password)
    setIsLoading(false)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col">
      <div className="flex text-2xl font-bold text-gray-900 w-full justify-center">
        Вход
      </div>
      <div className="flex flex-col gap-2">
        <input
          {...register('email')}
          type="email"
          required
          placeholder="Почта"
          className={errors.email ? 'border-red-500!' : ''}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
        <input
          {...register('password')}
          type="password"
          required
          placeholder="Пароль"
          className={errors.password ? 'border-red-500!' : ''}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
        <div className="flex justify-end w-full text-gray-500">
          Забыл пароль
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[var(--main-text-color)]! text-white!"
      >
        {isLoading ? 'Загрузка...' : 'Войти'}
      </button>
    </form>
  )
}
