import { Button } from '@/components/ui/button/Button'
import {
  registerLegalSchema,
  RegisterLegalSchema,
} from '@/lib/schemes/auth/register.schema'
import { OrganizationForm } from '@/types/olf'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './RegisterForm.module.scss'

interface RegisterFormLegalProps {
  olfLegal: OrganizationForm[]
}

export default function RegisterFormLegal({
  olfLegal,
}: RegisterFormLegalProps) {
  const [generalError, setGeneralError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<RegisterLegalSchema>({
    resolver: zodResolver(registerLegalSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: RegisterLegalSchema) => {
    setGeneralError(null)
    try {
      const response = await fetch('/api/auth/registration', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      try {
        const result = await response.json()
        if (!response.ok) {
          setGeneralError(result?.message || 'Ошибка регистрации')
          return
        }

        // Success logic here
        console.log('registration result:', result)
        if (!result.result) {
          setGeneralError(`${result.message}, код ошибки: ${result.status}`)
          return
        }
      } catch (e) {
        setGeneralError('Ошибка регистрации')
        return
      }
    } catch (err) {
      setGeneralError(
        err instanceof Error ? err.message : 'Ошибка сети или сервера'
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.fieldGroup}>
      {generalError && <span className={styles.errorText}>{generalError}</span>}
      <select
        {...register('olf')}
        className={styles.select}
        defaultValue={olfLegal[0]?.name || ''}
        onChange={(e) => setValue('olf', e.target.value)}
      >
        {olfLegal.map((item, idx) => (
          <option key={idx} value={item.name}>
            {item.primary ? `⭐ ${item.name}` : item.name}
          </option>
        ))}
      </select>
      <input
        {...register('organizationName')}
        type="text"
        placeholder="Название организации"
        className={errors.organizationName ? styles.inputError : styles.input}
      />
      {errors.organizationName?.message && (
        <span className={styles.errorText}>
          {errors.organizationName?.message}
        </span>
      )}
      <input
        {...register('phone')}
        type="text"
        placeholder="Телефон"
        className={errors.phone ? styles.inputError : styles.input}
      />
      {errors.phone?.message && (
        <span className={styles.errorText}>{errors.phone?.message}</span>
      )}
      <input
        {...register('email')}
        type="email"
        required
        placeholder="Почта"
        autoComplete="new-email"
        className={errors.email ? styles.inputError : ''}
      />
      {errors.email?.message && (
        <span className={styles.errorText}>{errors.email?.message}</span>
      )}
      <input
        {...register('password')}
        type="password"
        required
        placeholder="Пароль"
        autoComplete="new-password"
        className={errors.password ? styles.inputError : ''}
      />
      {errors.password?.message && (
        <span className={styles.errorText}>{errors.password?.message}</span>
      )}
      <input
        {...register('brand')}
        type="text"
        placeholder="Название бренда"
        className={errors.brand ? styles.inputError : ''}
      />
      {errors.brand?.message && (
        <span className={styles.errorText}>{errors.brand?.message}</span>
      )}
      <input
        {...register('inn')}
        type="text"
        placeholder="ИНН (10 цифр)"
        className={errors.inn ? styles.inputError : ''}
      />
      {errors.inn?.message && (
        <span className={styles.errorText}>{errors.inn?.message}</span>
      )}
      <Button type="submit" variant="primary" fullWidth>
        Зарегистрироваться
      </Button>
    </form>
  )
}
