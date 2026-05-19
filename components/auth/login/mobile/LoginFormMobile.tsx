'use client'

import { authSchema, AuthSchema } from '@/lib/schemes/auth'
import { formatTime } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider/AuthProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './LoginMobile.module.scss'
import { Button } from '@/components/ui/button/Button'
import { Eye, EyeOff } from 'lucide-react'

export function LoginFormMobile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  })

  const { login, error, blockTime, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)


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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper_logo}>
        <Image
          src="/alt-logo.svg"
          alt="logo"
          width={120}
          height={24}
          priority
          className="w-auto h-auto"
        />
      </div>
      <div className={styles.title}>Вход</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.form}>
          <input
            {...register('email')}
            type="email"
            required
            placeholder="Почта"
            className={errors.email ? styles.inputError : styles.input}
          />
          {errors.email && (
            <span className={styles.errorText}>{errors.email.message}</span>
          )}

          <div className={styles.passwordWrapper}>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Пароль"
              className={errors.password ? styles.inputError : styles.input}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={styles.passwordToggle}
            >
              {showPassword ? (
                <EyeOff size={20} className={styles.eyeIcon} />
              ) : (
                <Eye size={20} className={styles.eyeIcon} />
              )}
            </button>
          </div>

          {errors.password && (
            <span className={styles.errorText}>{errors.password.message}</span>
          )}
          {!isAuthenticated && countdown}
          {!isAuthenticated && error && (
            <span className={styles.errorText}>{error}</span>
          )}

          <Link href="/reset-password" className={styles.forgotPasswordLink}>
            Забыли пароль?
          </Link>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
          >
            {isLoading ? 'Загрузка...' : 'Войти'}
          </Button>
        </div>
      </form>

      <div className={styles.registerWrapper}>
        <div className={styles.registerWrapper_text}>
          Еще нет аккаунта?{' '}
          <Link href="/registration" className={styles.registerWrapper_link}>
            Регистрация.
          </Link>
        </div>
      </div>
    </div>
  )
}
