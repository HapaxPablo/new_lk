'use client'

import { authSchema, AuthSchema } from '@/lib/schemes/auth'
import { formatTime } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider/AuthProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './LoginDesktop.module.css'
import { Button } from '@/components/ui/button/Button'


export function LoginFormDesktop() {
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
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.logoWrapper}>
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

        <div className={styles.formFields}>
          <input
            {...register('email')}
            type="email"
            required
            placeholder="Почта"
            className={errors.email ? styles.inputError : ''}
          />
          {errors.email && (
            <span className={styles.errorText}>{errors.email.message}</span>
          )}
          <input
            {...register('password')}
            type="password"
            required
            placeholder="Пароль"
            className={errors.password ? styles.inputError : ''}
          />
          {errors.password && (
            <span className={styles.errorText}>{errors.password.message}</span>
          )}
          {!isAuthenticated && countdown}
          {!isAuthenticated && error && (
            <span className={styles.errorText}>{error}</span>
          )}

          <Link href="/" className={styles.forgotPassword}>
            Забыл пароль
          </Link>
        </div>
        <Button type="submit" variant="primary" isLoading={isLoading} fullWidth>
          {isLoading ? 'Загрузка...' : 'Войти'}
        </Button>
        
        <div className={styles.loginWrapper}>
          <div className={styles.loginWrapper_text}>
            Еще нет аккаунта?{' '}
            <Link href="/registration" className={styles.loginWrapper_link}>
              Регистрация.
            </Link>
          </div>
        </div>
      </form>

      <div className={styles.imgWrapper}>
        <div className={styles.img} />
      </div>

      {/* делал для теста<Image src="/wall.jpg" fill className="h-auto w-auto -z-1" alt="wall" /> */}
    </div>
  )
}
