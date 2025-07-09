import validator from 'validator'
import * as z from 'zod'

export const baseFields = z.object({
  email: z.string().email({ message: 'Некорректная почта' }),
  password: z
    .string()
    .min(6, { message: 'Пароль должен содержать 6 символов или более' }),
  phone: z.string().refine((val) => validator.isMobilePhone(val, 'ru-RU'), {
    message: 'Некорректный номер телефона',
  }),
  opf: z.string(),
  brand: z.string(),
  type: z.enum(['individual', 'legal']),
})

const individualFields = z.object({
  name: z.string(),
  surName: z.string(),
  patronymic: z.string().optional(),
  inn: z.string().refine((val) => /^[0-9]{12}$/.test(val), {
    message: 'ИНН должен содержать 12 цифр',
  }),
})

const legalFields = z.object({
  organizationName: z.string(),
  inn: z.string().refine((val) => /^[0-9]{10}$/.test(val), {
    message: 'ИНН должен содержать 10 цифр',
  }),
})

export const registerUnifiedSchema = z.discriminatedUnion('type', [
  baseFields.merge(individualFields).extend({ type: z.literal('individual') }),
  baseFields.merge(legalFields).extend({ type: z.literal('legal') }),
])

export type RegisterUnifiedSchema = z.infer<typeof registerUnifiedSchema>
