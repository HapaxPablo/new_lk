import validator from 'validator'
import * as z from 'zod'

/** Схема для ФИЗИЧЕСКОГО ЛИЦА */
export const registerIndividualSchema = z.object({
  email: z.string().email('Некорректная почта'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  phone: z.string().refine((val) => validator.isMobilePhone(val, 'ru-RU'), {
    message: 'Некорректный номер телефона',
  }),
  name: z.string().min(1, 'Имя обязательно'),
  surName: z.string().min(1, 'Фамилия обязательна'),
  patronymic: z.string().optional(),
  opf: z.string().min(1, 'ОПФ обязательно'),
  brand: z.string().min(1, 'Название бренда обязательно'),
  inn: z.string().regex(/^\d{12}$/, 'ИНН физ. лица должен содержать 12 цифр'),
})

export type RegisterIndividualSchema = z.infer<typeof registerIndividualSchema>

/** Схема для ЮРИДИЧЕСКОГО ЛИЦА */
export const registerLegalSchema = z.object({
  email: z.string().email('Некорректная почта'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  phone: z.string().refine((val) => validator.isMobilePhone(val, 'ru-RU'), {
    message: 'Некорректный номер телефона',
  }),
  organizationName: z.string().min(1, 'Название организации обязательно'),
  opf: z.string().min(1, 'ОПФ обязательно'),
  brand: z.string().min(1, 'Название бренда обязательно'),
  inn: z.string().regex(/^\d{10}$/, 'ИНН юр. лица должен содержать 10 цифр'),
})

export type RegisterLegalSchema = z.infer<typeof registerLegalSchema>
