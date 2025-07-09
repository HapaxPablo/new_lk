import { Button } from '@/components/ui/button/Button'
import {
  registerIndividualSchema,
  RegisterIndividualSchema,
} from '@/lib/schemes/auth/register.schema'
import { OrganizationForm } from '@/types/olf'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './RegisterForm.module.scss'

interface RegisterFormIndividualProps {
  olfIndividual: OrganizationForm[]
}

export default function RegisterFormIndividual({
  olfIndividual,
}: RegisterFormIndividualProps) {
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<RegisterIndividualSchema>({
    resolver: zodResolver(registerIndividualSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: RegisterIndividualSchema) => {
    setGeneralError(null)
    setSuccess(false)
    // mock registration
    if (data.email === 'already@taken.ru') {
      setGeneralError('Пользователь с такой почтой уже существует')
    } else {
      setSuccess(true)
      reset()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.fieldGroup}>
      {success && (
        <span className={styles.successText}>Регистрация успешна!</span>
      )}
      {generalError && <span className={styles.errorText}>{generalError}</span>}
      <select
        {...register('opf')}
        className={styles.select}
        defaultValue={olfIndividual[0]?.name || ''}
        onChange={(e) => setValue('opf', e.target.value)}
      >
        {olfIndividual.map((item, idx) => (
          <option key={idx} value={item.name}>
            {item.primary ? `⭐ ${item.name}` : item.name}
          </option>
        ))}
      </select>
      <input
        {...register('name')}
        type="text"
        placeholder="Имя"
        className={errors.name ? styles.inputError : styles.input}
      />
      {errors.name?.message && (
        <span className={styles.errorText}>{errors.name?.message}</span>
      )}
      <input
        {...register('surName')}
        type="text"
        placeholder="Фамилия"
        className={errors.surName ? styles.inputError : styles.input}
      />
      {errors.surName?.message && (
        <span className={styles.errorText}>{errors.surName?.message}</span>
      )}
      <input
        {...register('patronymic')}
        type="text"
        placeholder="Отчество (необязательно)"
        className={errors.patronymic ? styles.inputError : styles.input}
      />
      {errors.patronymic?.message && (
        <span className={styles.errorText}>{errors.patronymic?.message}</span>
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
        placeholder="ИНН (12 цифр)"
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
