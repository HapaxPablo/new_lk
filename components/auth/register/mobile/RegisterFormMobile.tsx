'use client'

import {
  RegisterIndividualSchema,
  RegisterLegalSchema,
} from '@/lib/schemes/auth'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { ofl } from './opf'
import styles from './RegisterFormMobile.module.scss'

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

export function RegisterFormMobile() {
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterIndividualSchema | RegisterLegalSchema>({
    defaultValues: {
      opf: '',
    },
  })

  const selectedType = useWatch({ control, name: 'opf' })

  const isIndividual = useMemo(() => {
    if (!selectedType) return false
    return Object.keys(ofl.individualTypes).some(
      (key) => Number(key) === Number(selectedType)
    )
  }, [selectedType])

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

  return (
    <form
      className={styles.form}
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.title}>Регистрация</div>

      {generalError && <span className={styles.errorText}>{generalError}</span>}

      <div className={styles.fieldGroup}>
        <select
          id="opf"
          {...register('opf')}
          defaultValue=""
          className={styles.select}
        >
          <option value="" disabled>
            ОПФ
          </option>
          <optgroup label="Физические лица">
            {Object.entries(ofl.individualTypes).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </optgroup>
          <optgroup label="Юридические лица">
            {Object.entries(ofl.legalTypes).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </optgroup>
        </select>
        {errors.opf && (
          <span className={styles.errorText}>{errors.opf.message}</span>
        )}

        {selectedType !== '' && isIndividual && (
          <>
            <input {...register('name')} type="text" placeholder="Имя" />
            <input {...register('surName')} type="text" placeholder="Фамилия" />
          </>
        )}
        {selectedType !== '' && !isIndividual && (
          <input
            {...register('surName')}
            type="text"
            placeholder="Название организации"
          />
        )}

        <input
          {...register('phone')}
          type="text"
          placeholder="Телефон"
          className={errors.phone ? styles.inputError : ''}
        />
        {errors.phone && (
          <span className={styles.errorText}>{errors.phone.message}</span>
        )}

        <input
          {...register('email')}
          type="email"
          required
          placeholder="Почта"
          autoComplete="new-email"
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
          autoComplete="new-password"
          className={errors.password ? styles.inputError : ''}
        />
        {errors.password && (
          <span className={styles.errorText}>{errors.password.message}</span>
        )}

        <input
          {...register('brand')}
          type="text"
          placeholder="Название бренда"
          className={errors.brand ? styles.inputError : ''}
        />
        {errors.brand && (
          <span className={styles.errorText}>{errors.brand.message}</span>
        )}

        <input
          {...register('inn')}
          type="text"
          placeholder="ИНН"
          className={errors.inn ? styles.inputError : ''}
        />
        {errors.inn && (
          <span className={styles.errorText}>{errors.inn.message}</span>
        )}
      </div>

      <button type="submit" className={styles.submitButton}>
        Зарегистрироваться
      </button>
    </form>
  )
}
