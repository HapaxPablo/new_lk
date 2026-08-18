'use client'

import { useAuth } from '@/providers/auth-provider/AuthProvider'
import { USER_ROLE_LABELS } from '@/types/user'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import styles from './UserSettings.module.scss'

type ProfileForm = {
  last_name: string
  first_name: string
  middle_name: string
  email: string
  phone_number: string
}

const emptyForm: ProfileForm = {
  last_name: '',
  first_name: '',
  middle_name: '',
  email: '',
  phone_number: '',
}

export function UserSettings() {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const [form, setForm] = useState<ProfileForm>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (!user) return
    setForm({
      last_name: user.last_name || '',
      first_name: user.first_name || '',
      middle_name: user.middle_name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
    })
  }, [user])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/auth/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Не удалось сохранить настройки')
      }

      await refreshUser()
      showToast('Настройки сохранены', 'success')
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Не удалось сохранить настройки',
        'error'
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !user) {
    return <div className={styles.state}>Загрузка настроек…</div>
  }

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <h1>Настройки профиля</h1>
        <p className={styles.role}>
          Роль: {USER_ROLE_LABELS[user.role] || user.role}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Фамилия
            <input
              value={form.last_name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  last_name: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Имя
            <input
              value={form.first_name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  first_name: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Отчество
            <input
              value={form.middle_name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  middle_name: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
            />
          </label>
          <label>
            Телефон
            <input
              type="tel"
              value={form.phone_number}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  phone_number: event.target.value,
                }))
              }
            />
          </label>
          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Сохраняем…' : 'Сохранить'}
          </button>
        </form>
      </div>
    </section>
  )
}
