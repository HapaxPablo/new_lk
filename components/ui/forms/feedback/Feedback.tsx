'use client'

import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { IMaskInput } from 'react-imask'
import { Button } from '../../button/Button'
import styles from './Feedback.module.scss'
import { useHttpClient } from '@/hooks/useHttpClient'

/**
 * 📐 ZOD схема
 */
const schema = z.object({
    name: z.string().min(2, 'Минимум 2 символа'),
    phone: z.string().min(18, 'Введите полный номер'),
    email: z.string().email('Некорректный email'),
    message: z.string().optional()
})

type FormValues = z.infer<typeof schema>

export default function Feedback() {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting,
            isSubmitSuccessful,
            isValid,
        },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: 'onChange', // 🔥 важно для UX
        shouldFocusError: true,
    })

    const { client } = useHttpClient()

    const onSubmit = async (data: FormValues) => {
        try {
            // 🧼 очищаем телефон
            const cleanPhone = data.phone.replace(/\D/g, '')

            const payload = {
                ...data,
                phone: cleanPhone,
            }

            await new Promise((res) => setTimeout(res, 1000))

            // console.log('SEND:', payload)

            client.post('api/feedback/', data)

            reset()
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h2 className={styles.title}>Свяжитесь с нами</h2>
            <p className={styles.subtitle}>Ответим в течение 15 минут</p>

            <div className={styles.flex}>
                {/* NAME */}
                <div className={styles.field}>
                    <input
                        placeholder="Иван"
                        {...register('name')}
                        className={styles.input}
                    />
                    {errors.name && (
                        <span className={styles.error}>{errors.name.message}</span>
                    )}
                </div>

                {/* PHONE */}
                <div className={styles.field}>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <IMaskInput
                                mask="+{7} (000) 000-00-00"
                                value={field.value}
                                onAccept={(value) => field.onChange(value)}
                                placeholder="+7 (___) ___-__-__"
                                className={styles.input}
                            />
                        )}
                    />
                    {errors.phone && (
                        <span className={styles.error}>{errors.phone.message}</span>
                    )}
                </div>


                {/* EMAIL */}
                <div className={`${styles.field}`}>
                    <input
                        type="email"
                        placeholder="email@mail.com"
                        {...register('email')}
                        className={styles.input}
                    />
                    {errors.email && (
                        <span className={styles.error}>{errors.email.message}</span>
                    )}
                </div>

                <div className={styles.field} >
                    <textarea
                        placeholder='Задайте свой вопрос или оставьте пожелание'
                        className={styles.input}
                        {...register('message')}
                    />
                </div>
            </div>
            <Button
                type="submit"
                disabled={(!isValid || isSubmitting) && !isSubmitSuccessful}
                className={styles.button}
            >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </Button>

            {isSubmitSuccessful && (
                <p className={styles.success}>Заявка отправлена ✔</p>
            )}
        </form>
    )
}