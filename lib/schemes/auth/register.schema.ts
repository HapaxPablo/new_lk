import validator from 'validator'
import * as z from 'zod'

export const registerSchema = z
  .object({
    type: z.enum(['individual', 'legal']),
    email: z.string().email('Некорректная почта'),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
    phone: z.string().refine((val) => validator.isMobilePhone(val, 'ru-RU'), {
      message: 'Некорректный номер телефона',
    }),
    firstname: z.string().min(1, 'Имя обязательно'),
    surname: z.string().min(1, 'Фамилия обязательна'),
    patronymic: z.string().optional(),
    organizationName: z.string().optional(),
    olf: z.string().min(1, 'ОПФ обязательно'),
    brand: z.string().min(1, 'Название бренда обязательно'),
    inn: z.string(),
  })
  .refine(
    (data) => {
      const isIndividual = data.type === 'individual'
      const pattern = isIndividual ? /^\d{12}$/ : /^\d{10}$/
      return pattern.test(data.inn)
    },
    {
      message: 'ИНН должен содержать 10 (юр. лицо) или 12 (физ. лицо) цифр',
      path: ['inn'],
    }
  )
  .refine(
    (data) => {
      if (data.type === 'legal') {
        return data.organizationName && data.organizationName.length > 0
      }
      return true
    },
    {
      message: 'Название организации обязательно для юридических лиц',
      path: ['organizationName'],
    }
  )

export type RegisterSchema = z.infer<typeof registerSchema>
