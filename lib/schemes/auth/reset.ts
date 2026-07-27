import * as z from 'zod'

export const resetPasswordSchema = z.object({
  email: z.string().email({
    message: 'Некорректная почта',
  }),
  new_password: z.string().min(3, {
    message: 'Пароль должен содержать 3 символов или более',
  }),
  new_password_confirm: z.string().min(3, {
    message: 'Подтверждение пароля должно содержать 3 символов или более',
  }),
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
