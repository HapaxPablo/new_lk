'use client'

import { useOlfFetcher } from '@/hooks/useOlfFetcher'
import {
  registerUnifiedSchema,
  RegisterUnifiedSchema,
} from '@/lib/schemes/auth/register.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './RegisterFormDesktop.module.scss'

export async function mockRegister(
  data: any
): Promise<{ success: boolean; message?: string }> {
  console.log('data promise:', data)
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

export function RegisterFormDesktop() {
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [typeOlf, setTypeOlf] = useState<string>('')
  const [olfIndividualRegister, setOlfIndividualRegister] = useState<string>('')
  const [olfLegalRegister, setOlfLegalRegister] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<RegisterUnifiedSchema>({
    resolver: zodResolver(registerUnifiedSchema),
    defaultValues: { type: 'legal', opf: '' },
    mode: 'onBlur',
  })

  const onSubmit = async (data: any) => {
    setGeneralError(null)
    try {
      const result = await mockRegister(data)
      if (!result.success) {
        setGeneralError(result.message || 'Ошибка регистрации')
      } else {
        alert('ЗАГЛУШКА!!! Регистрация успешна!')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setGeneralError('Что-то пошло не так')
    }
  }

  const { olfIndividual, olfLegal } = useOlfFetcher(typeOlf)

  useEffect(() => {
    // Сброс формы при смене типа
    reset({ opf: '' })
    if (typeOlf === 'individual' && olfIndividual?.length) {
      const primary = olfIndividual.find((item) => item.primary)
      setOlfIndividualRegister(primary ? primary.name : olfIndividual[0].name)
    }
    if (typeOlf === 'legal' && olfLegal?.length) {
      const primary = olfLegal.find((item) => item.primary)
      setOlfLegalRegister(primary ? primary.name : olfLegal[0].name)
    }
  }, [typeOlf, olfIndividual, olfLegal, reset])

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
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
        <div className={styles.title}>Регистрация</div>

        {typeof generalError === 'string' && generalError && (
          <span className={styles.errorText}>{generalError}</span>
        )}

        <div className={styles.fieldGroup}>
          {errors.type?.message && (
            <span className={styles.errorText}>
              {String(errors.type.message)}
            </span>
          )}

          <select
            {...register('type')}
            onChange={(e) => {
              const value = e.target.value as 'individual' | 'legal'
              setTypeOlf(value)
              setOlfIndividualRegister('')
              setOlfLegalRegister('')
              setValue('type', value) // нужно явно обновлять, чтобы схема знала
            }}
            className={styles.select}
            value={typeOlf}
          >
            <option value="" disabled>
              ОПФ
            </option>
            <option value="individual">Физическое лицо</option>
            <option value="legal">Юридическое лицо</option>
          </select>

          {typeOlf === 'individual' && olfIndividual && (
            <select
              id="opf"
              {...register('opf')}
              value={olfIndividualRegister}
              className={styles.select}
              onChange={(e) => setOlfIndividualRegister(e.target.value)}
            >
              {olfIndividual.map((item, idx) => (
                <option key={idx} value={item.name}>
                  {item.primary ? `⭐ ${item.name}` : item.name}
                </option>
              ))}
            </select>
          )}

          {typeOlf === 'legal' && olfLegal && (
            <select
              id="opf"
              {...register('opf')}
              value={olfLegalRegister}
              className={styles.select}
              onChange={(e) => setOlfLegalRegister(e.target.value)}
            >
              {olfLegal.map((item, idx) => (
                <option key={idx} value={item.name}>
                  {item.primary ? `⭐ ${item.name}` : item.name}
                </option>
              ))}
            </select>
          )}

          {olfIndividualRegister && typeOlf === 'individual' && (
            <>
              <input
                {...register('name')}
                type="text"
                placeholder="Имя"
                className={errors ? styles.inputError : styles.input}
              />

              <input
                {...register('surName')}
                type="text"
                placeholder="Фамилия"
                className={errors ? styles.inputError : styles.input}
              />

              <input
                {...register('patronymic')}
                type="text"
                placeholder="Отчество (необязательно)"
                className={errors ? styles.inputError : styles.input}
              />
            </>
          )}
          {olfLegalRegister && typeOlf === 'legal' && (
            <>
              <input
                {...register('organizationName')}
                type="text"
                placeholder="Название организации"
                className={errors ? styles.inputError : styles.input}
              />
            </>
          )}

          <input
            {...register('phone')}
            type="text"
            placeholder="Телефон"
            className={errors.phone ? styles.inputError : styles.input}
          />

          <input
            {...register('email')}
            type="email"
            required
            placeholder="Почта"
            autoComplete="new-email"
            className={errors.email ? styles.inputError : ''}
          />

          <input
            {...register('password')}
            type="password"
            required
            placeholder="Пароль"
            autoComplete="new-password"
            className={errors.password ? styles.inputError : ''}
          />

          <input
            {...register('brand')}
            type="text"
            placeholder="Название бренда"
            className={errors.brand ? styles.inputError : ''}
          />

          {typeOlf === 'individual' && (
            <input
              {...register('inn')}
              type="text"
              placeholder="ИНН (12 цифр)"
              className={errors.inn ? styles.inputError : ''}
            />
          )}
          {typeOlf === 'legal' && (
            <input
              {...register('inn')}
              type="text"
              placeholder="ИНН (10 цифр)"
              className={errors.inn ? styles.inputError : ''}
            />
          )}
        </div>

        <button type="submit" className={styles.submitButton}>
          Зарегистрироваться
        </button>

        <div className={styles.registerWrapper}>
          <div className={styles.registerWrapper_text}>
            Уже есть аккаунт?{' '}
            <Link href="/login" className={styles.registerWrapper_link}>
              Войдите здесь.
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
