import { useOrderCreate } from '@/providers/order/OrderCreateContext'
import styles from '@/app/(main)/order/OrderCreate.module.scss'

const DAYS = [
    { key: 'mon', label: 'Пн' },
    { key: 'tue', label: 'Вт' },
    { key: 'wed', label: 'Ср' },
    { key: 'thu', label: 'Чт' },
    { key: 'fri', label: 'Пт' },
    { key: 'sat', label: 'Сб' },
    { key: 'sun', label: 'Вс' },
]

export function DaysOfWeekPicker() {
    const { order: { form, setForm, errors } } = useOrderCreate()

    const toggleAllDays = () =>
        setForm((p) => ({ ...p, all_days: !p.all_days, days_of_week: [] }))

    const toggleDay = (key: string) =>
        setForm((p) => ({
            ...p,
            days_of_week: p.days_of_week.includes(key)
                ? p.days_of_week.filter((d) => d !== key)
                : [...p.days_of_week, key],
        }))

    return (
        <div className={styles.days}>
            <label className={styles.form__label}>Дни размещения</label>

            <label className={styles.days__checkbox}>
                <input
                    type="checkbox"
                    checked={form.all_days}
                    onChange={toggleAllDays}
                />
                <div className={styles.days__box} />
                <span className={styles.days__text}>
                    {form.all_days ? 'Все дни недели' : 'Выбрать дни'}
                </span>
            </label>

            {!form.all_days && (
                <div className={styles.days__grid}>
                    {DAYS.map((d) => (
                        <button
                            key={d.key}
                            type="button"
                            onClick={() => toggleDay(d.key)}
                            className={`${styles.days__day} ${form.days_of_week.includes(d.key)
                                ? styles['days__day--active']
                                : ''
                                }`}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            )}

            {errors.days_of_week && (
                <p className={styles.form__error}>
                    {errors.days_of_week}
                </p>
            )}
        </div>
    )
}