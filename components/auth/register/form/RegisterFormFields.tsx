import { Button } from '@/components/ui/button/Button'
import { useOlfFetcher } from '@/hooks/useOlfFetcher'
import {
  registerSchema,
  RegisterSchema,
} from '@/lib/schemes/auth/register.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './RegisterForm.module.scss'

export default function RegisterFormFields({
  setEmail,
  setCanConfirm,
  showNotification,
}: {
  setEmail: (email: string) => void
  setCanConfirm: (can: boolean) => void
  showNotification: (msg: string, type: 'success' | 'error') => void
}) {
  const [typeOlf, setTypeOlf] = useState<'individual' | 'legal'>('individual')
  const { olfIndividual, olfLegal } = useOlfFetcher(typeOlf)
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      type: 'individual',
    },
  })

  const selectedOlfList = typeOlf === 'individual' ? olfIndividual : olfLegal

  const onSubmit = async (data: RegisterSchema) => {
    setGeneralError(null)
    const { type, ...rest } = data
    const apiData: any = {
      ...rest,
      firstname: data.firstname,
      surname: data.surname,
    }
    if (typeOlf === 'individual') {
      apiData.organizationName =
        `${data.surname || ''} ${data.firstname || ''} ${data.patronymic || ''}`.trim()
    }
    try {
      const response = await fetch('/api/auth/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })
      const result = await response.json()
      if (!response.ok || !result.result) {
        setGeneralError(result?.message || 'Ошибка регистрации')
        showNotification(`${result.message}`, 'error')
      } else {
        setEmail(apiData.email)
        showNotification(`${result.message}`, 'success')
        setCanConfirm(result.result)
      }
    } catch (err) {
      setGeneralError('Ошибка сети или сервера')
    }
  }

  const onError = (errors: any) => {
    // eslint-disable-next-line no-console
    console.log('Ошибки валидации:', errors)
  }

  useEffect(() => {
    setValue('type', typeOlf)
    setValue('olf', selectedOlfList?.[0]?.name || '')
  }, [typeOlf, selectedOlfList, setValue])

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className={styles.formWrapper}
    >
      <div className={styles.logoWrapper}>
        <Image
          src="/alt-logo.svg"
          alt="logo"
          width={120}
          height={24}
          priority
        />
      </div>
      <h2 className={styles.title}>Регистрация</h2>
      {generalError && <span className={styles.errorText}>{generalError}</span>}
      <div className={styles.fieldGroup}>
        <select
          className={styles.select}
          value={typeOlf}
          onChange={(e) => setTypeOlf(e.target.value as 'individual' | 'legal')}
        >
          <option value="individual">Физическое лицо</option>
          <option value="legal">Юридическое лицо</option>
        </select>
        <select
          {...register('olf')}
          className={styles.select}
          defaultValue={selectedOlfList?.[0]?.name || ''}
          onChange={(e) => setValue('olf', e.target.value)}
        >
          {selectedOlfList?.map((item: any, idx: number) => (
            <option key={idx} value={item.name}>
              {item.primary ? `⭐ ${item.name}` : item.name}
            </option>
          ))}
        </select>
        {errors.olf && (
          <span className={styles.errorText}>{errors.olf.message}</span>
        )}
        <input
          {...register('surname')}
          placeholder="Фамилия"
          className={errors.surname ? styles.inputError : styles.input}
        />
        {errors.surname && (
          <span className={styles.errorText}>{errors.surname.message}</span>
        )}
        <input
          {...register('firstname')}
          placeholder="Имя"
          className={errors.firstname ? styles.inputError : styles.input}
        />
        {errors.firstname && (
          <span className={styles.errorText}>{errors.firstname.message}</span>
        )}
        <input
          {...register('patronymic')}
          placeholder="Отчество (необязательно)"
          className={errors.patronymic ? styles.inputError : styles.input}
        />
        {errors.patronymic && (
          <span className={styles.errorText}>{errors.patronymic.message}</span>
        )}
        {typeOlf === 'legal' && (
          <>
            <input
              {...register('organizationName')}
              placeholder="Название организации"
              className={
                errors.organizationName ? styles.inputError : styles.input
              }
            />
            {errors.organizationName && (
              <span className={styles.errorText}>
                {errors.organizationName.message}
              </span>
            )}
          </>
        )}
        <input
          {...register('phone')}
          placeholder="Телефон"
          className={errors.phone ? styles.inputError : styles.input}
        />
        {errors.phone && (
          <span className={styles.errorText}>{errors.phone.message}</span>
        )}
        <input
          {...register('email')}
          placeholder="Почта"
          className={errors.email ? styles.inputError : styles.input}
        />
        {errors.email && (
          <span className={styles.errorText}>{errors.email.message}</span>
        )}
        <input
          {...register('password')}
          type="password"
          placeholder="Пароль"
          className={errors.password ? styles.inputError : styles.input}
        />
        {errors.password && (
          <span className={styles.errorText}>{errors.password.message}</span>
        )}
        <input
          {...register('brand')}
          placeholder="Название бренда"
          className={errors.brand ? styles.inputError : styles.input}
        />
        {errors.brand && (
          <span className={styles.errorText}>{errors.brand.message}</span>
        )}
        <input
          {...register('inn')}
          placeholder={`ИНН (${typeOlf === 'individual' ? '12' : '10'} цифр)`}
          className={errors.inn ? styles.inputError : styles.input}
        />
        {errors.inn && (
          <span className={styles.errorText}>{errors.inn.message}</span>
        )}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </div>
      <div className={styles.registerWrapper}>
        <div className={styles.registerWrapper_text}>
          Уже есть аккаунт?{' '}
          <Link href="/login" className={styles.registerWrapper_link}>
            Войдите здесь.
          </Link>
        </div>
      </div>
    </form>
  )
}
