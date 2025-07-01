import * as z from 'zod'

export const authSchema = z.object({
  email: z.string().email({
    message: 'Некорректная почта',
  }),
  password: z.string().min(6, {
    message: 'Пароль должен содержать 6 символов или более',
  }),
})

export type AuthSchema = z.infer<typeof authSchema>
