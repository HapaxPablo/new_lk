'use client'
import { ResetPasswordSchema, resetPasswordSchema } from '@/lib/schemes/auth/reset'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './ResetPassword.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button/Button'
import { Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { useRouter } from 'next/navigation'


export default function ResetPassword() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
    })
    const [isLoading, setIsLoading] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { showToast } = useToast()
    const router = useRouter()
    const onSubmit = async (data: ResetPasswordSchema) => {
        setIsLoading(true)
        const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                new_password: data.new_password,
                new_password_confirm: data.new_password_confirm,
            }),
        })
        const result = await response.json()
        if (!response.ok || !result.detail) {
            showToast(`${result.detail}`, 'error')
        } else {
            showToast(`${result.detail}`, 'success')
            router.push('/login')
        }
        setIsLoading(false)
    }

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
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
                <div className={styles.title}>Сброс пароля</div>

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

                    <div className={styles.passwordWrapper}>
                        <input
                            {...register('new_password')}
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            placeholder="Новый пароль"
                            className={errors.new_password ? styles.inputError : styles.input}
                        />
                        <button
                            type="button"
                            onClick={toggleNewPasswordVisibility}
                            className={styles.passwordToggle}
                        >
                            {showNewPassword ? (
                                <EyeOff size={20} className={styles.eyeIcon} />
                            ) : (
                                <Eye size={20} className={styles.eyeIcon} />
                            )}
                        </button>
                    </div>

                    {errors.new_password && (
                        <span className={styles.errorText}>{errors.new_password.message}</span>
                    )}

                    <div className={styles.passwordWrapper}>
                        <input
                            {...register('new_password_confirm')}
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            placeholder="Подтвердите новый пароль"
                            className={errors.new_password_confirm ? styles.inputError : styles.input}
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className={styles.passwordToggle}
                        >
                            {showConfirmPassword ? (
                                <EyeOff size={20} className={styles.eyeIcon} />
                            ) : (
                                <Eye size={20} className={styles.eyeIcon} />
                            )}
                        </button>
                    </div>

                    {errors.new_password_confirm && (
                        <span className={styles.errorText}>{errors.new_password_confirm.message}</span>
                    )}
                </div>
                <Button type="submit" variant="primary" isLoading={isLoading} fullWidth>
                    {isLoading ? 'Загрузка...' : 'Отправить'}
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
        </div>
    )
}
