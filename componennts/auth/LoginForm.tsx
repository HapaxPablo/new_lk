'use client'

import { useAuth } from '@/providers/auth-provider/auth-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AuthSchema, authSchema } from './schema/auth.schema'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  })
  const { login, isLoading } = useAuth()

  const onSubmit = async ({ email, password }: AuthSchema) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed')
      }
      console.log('RESPONSE', data)

      // Если успешно, перенаправляем пользователя
      router.push('/nomenclatures')
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-[14px]"
    >
      <div className="flex text-2xl font-bold text-gray-900 w-full justify-center">
        Вход
      </div>
      <div className="flex flex-col gap-[12px]">
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
