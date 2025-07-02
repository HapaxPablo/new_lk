'use client'

import {
  RegisterIndividualSchema,
  RegisterLegalSchema,
} from '@/lib/schemes/auth/register.schema'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { ofl } from './opf'

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

export default function RegisterForm() {
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterIndividualSchema | RegisterLegalSchema>({
    // resolver: zodResolver(schema),
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
    console.log('onSubmit data:', data)
    setGeneralError(null)
    try {
      const result = await mockRegister(data)
      if (!result.success) {
        setGeneralError(result.message || 'Ошибка регистрации')
      } else {
        alert('Регистрация успешна!')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setGeneralError('Что-то пошло не так')
    }
  }

  const handleFormSubmit = handleSubmit(onSubmit)

  console.log('Form errors:', errors)

  return (
    <form
      className="w-full flex flex-col gap-3"
      autoComplete="off"
      onSubmit={handleFormSubmit}
    >
      <div className="flex text-2xl font-bold text-main w-full justify-center">
        Регистрация
      </div>

      {generalError && (
        <span className="text-red-500 text-center">{generalError}</span>
      )}

      <div className="flex flex-col gap-2">
        <select
          id="opf"
          {...register('opf')}
          defaultValue=""
          className="border rounded p-2 w-full"
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
          <span className="text-red-500">{errors.opf.message}</span>
        )}
        {selectedType === '' ? null : isIndividual ? (
          <>
            <input
              {...register('name')}
              type="text"
              placeholder="Имя"
              // className={errors.name ? 'border border-red-500!' : ''}
            />
            {/* {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )} */}
            <input
              {...register('surName')}
              type="text"
              placeholder="Фамилия"
              // className={errors.surName ? 'border border-red-500!' : ''}
            />
            {/* {errors.surName && (
              <span className="text-red-500">{errors.surName.message}</span>
            )} */}
          </>
        ) : (
          <>
            <input
              {...register('surName')}
              type="text"
              placeholder="Название организации"
              // className={errors.surName ? 'border border-red-500!' : ''}
            />
            {/* {errors.surName && (
              <span className="text-red-500">{errors.surName.message}</span>
            )} */}
          </>
        )}

        <input
          {...register('phone')}
          type="text"
          placeholder="Телефон"
          className={errors.phone ? 'border border-red-500!' : ''}
        />
        {errors.phone && (
          <span className="text-red-500">{errors.phone.message}</span>
        )}
        {/* {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )} */}

        <input
          {...register('email')}
          type="email"
          required
          placeholder="Почта"
          autoComplete="new-email"
          className={errors.email ? 'border border-red-500!' : ''}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}

        <input
          {...register('password')}
          type="password"
          required
          placeholder="Пароль"
          autoComplete="new-password"
          className={errors.password ? 'border border-red-500!' : ''}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}

        <input
          {...register('brand')}
          type="text"
          placeholder="Название бренда"
          className={errors.brand ? 'border border-red-500!' : ''}
        />
        {errors.brand && (
          <span className="text-red-500">{errors.brand.message}</span>
        )}

        <input
          {...register('inn')}
          type="text"
          placeholder="ИНН"
          className={errors.inn ? 'border border-red-500!' : ''}
        />
        {errors.inn && (
          <span className="text-red-500">{errors.inn.message}</span>
        )}
      </div>

      <button type="submit" className="w-full bg-main-text! text-white!">
        Зарегистрироваться
      </button>
    </form>
  )
}
