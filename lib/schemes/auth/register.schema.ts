import validator from 'validator'
import * as z from 'zod'

export const registerIndividualSchema = z.object({
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
  patronymic: z.string().optional(),
  opf: z.string(),
  brand: z.string(),
  inn: z.string().refine((val) => /^[0-9]{12}$/.test(val), {
    message: 'ИНН должен содержать 12 цифр',
  }),
})

export type RegisterIndividualSchema = z.infer<typeof registerIndividualSchema>

export const registerLegalSchema = z.object({
  email: z.string().email({
    message: 'Некорректная почта',
  }),
  password: z.string().min(6, {
    message: 'Пароль должен содержать 6 символов или более',
  }),
  phone: z.string().refine((val) => validator.isMobilePhone(val, 'ru-RU'), {
    message: 'Некорректный номер телефона',
  }),
  organizationName: z.string(),
  opf: z.string(),
  brand: z.string(),
  inn: z.string().refine((val) => /^[0-9]{10}$/.test(val), {
    message: 'ИНН должен содержать 10 цифр',
  }),
})

export type RegisterLegalSchema = z.infer<typeof registerLegalSchema>
