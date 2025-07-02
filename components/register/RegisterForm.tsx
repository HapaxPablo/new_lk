'use client'

import { registerSchema, RegisterSchema } from '@/lib/schems/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export async function mockRegister(
  data: RegisterSchema
): Promise<{ success: boolean; message?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (data.email === 'already@taken.ru') {
        resolve({
          success: false,
          message: 'Пользователь с такой почтой уже существует',
        })
      } else {
        resolve({ success: true })
      }
    }, 1000)
  })
}

export default function RegisterForm() {
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterSchema) => {
    setGeneralError(null) // сбрасываем общую ошибку
    try {
      const result = await mockRegister(data)
      if (!result.success) {
        setGeneralError(result.message || 'Ошибка регистрации')
      } else {
        alert('Регистрация успешна!')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setGeneralError('Что-то пошло не так')
    }
  }

  return (
    <form
      className="w-full flex flex-col gap-[14px]"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex text-2xl font-bold text-[var(--main-text-color)] w-full justify-center">
        Регистрация
      </div>

      {generalError && (
        <span className="text-red-500 text-center">{generalError}</span>
      )}

      <div className="flex flex-col gap-[12px]">
        <input
          {...register('name')}
          type="text"
          placeholder="Имя"
          className={errors.name ? 'border border-red-500!' : ''}
        />
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}

        <input
          {...register('email')}
          type="email"
          required
          placeholder="Почта"
          autoComplete="new-email"
          className={errors.email ? 'border border-red-500!' : ''}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}

        <input
          {...register('password')}
          type="password"
          required
          placeholder="Пароль"
          autoComplete="new-password"
          className={errors.password ? 'border border-red-500!' : ''}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-[var(--main-text-color)]! text-white! py-2 rounded"
      >
        Зарегистрироваться
      </button>
    </form>
  )
}
