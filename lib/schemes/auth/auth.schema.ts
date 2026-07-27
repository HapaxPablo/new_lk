import * as z from 'zod'

export const authSchema = z.object({
  email: z.string().email({
    message: 'Некорректная почта',
  }),
  password: z.string().min(3, {
    message: 'Пароль должен содержать 3 символов или более',
  }),
})

export type AuthSchema = z.infer<typeof authSchema>
