'use client'

import { useForm } from 'react-hook-form'
import { useAuth } from '@/providers/auth-provider/auth-provider'


type FormData = {
  email: string
  password: string
}

export function LoginForm() {
  const { register, handleSubmit } = useForm<FormData>()
  const { login, isLoading } = useAuth()

  const onSubmit = async ({ email, password }: FormData) => {
    try {
      await login(email, password)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" required />
      <input {...register('password')} type="password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  )
}