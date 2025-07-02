import validator from 'validator'
import * as z from 'zod'

export const registerSchema = z.object({
  email: z.string().email({
    message: 'Некорректная почта',
  }),
  password: z.string().min(6, {
    message: 'Пароль должен содержать 6 символов или более',
  }),
  phone: z.string().refine((val) => validator.isMobilePhone(val, 'ru-RU'), {
    message: 'Некорректный номер телефона',
  }),
  name: z.string(),
  surName: z.string(),
  opf: z.string(),
  brand: z.string(),
  inn: z
    .string()
    .refine((val) => /^[0-9]{10}$/.test(val) || /^[0-9]{12}$/.test(val), {
      message: 'ИНН должен содержать 10 или 12 цифр',
    }),
})

export type RegisterSchema = z.infer<typeof registerSchema>
