import { useRouter } from 'next/navigation'
import { useNomenclatureStore } from '@/store/useNomenclatureStore'
import styles from '@/app/(main)/order/OrderCreate.module.scss'
import { useOrderCreate } from '@/providers/order/OrderCreateContext'
import { ModalWrapper } from '../modal/ModalWrapper'
import { LoginWrapper } from '../auth/login/LoginWrapper'
import { useModal } from '@/providers/modal/ModalProvider'

export function OrderSummary() {
    const router = useRouter()
    const { order, dateRange, mounted } = useOrderCreate()
    const { form, submitting, success, errors, handleSubmit } = order
    const { days } = dateRange

    const { ids, setInitial } = useNomenclatureStore()
    const totalPrice = useNomenclatureStore((s) => s.getTotalPrice())
    const finalPrice = totalPrice * days


    return (
        <>
            <div className={styles.form__group}>
                <label className={styles.form__label}>Количество дней</label>
                <input
                    type="number"
                    value={form.duration}
                    readOnly
                    className={styles.form__input}
                />
            </div>

            <div className={styles.summary} suppressHydrationWarning>
                <div>Выбрано мест: {mounted ? ids.length : '0'}</div>
                <div>Дней: {form.duration || '—'}</div>
            </div>

            <div className={styles.summary__total}>
                <span>Общая сумма</span>
                <span
                    className={styles.summary__amount}
                    suppressHydrationWarning
                >
                    {mounted ? finalPrice.toLocaleString('ru-RU') : '0'} ₽
                </span>
            </div>

            <div className={styles.summary__breakdown} suppressHydrationWarning>
                {mounted ? totalPrice.toLocaleString('ru-RU') : '0'} ₽
                {' '}× {form.duration || '—'} дней
            </div>

            <div className={styles.button}>
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={styles.button__create}
                >
                    {submitting ? 'Отправка...' : 'Создать заказ'}
                </button>

                <button
                    onClick={() => router.push('/nomenclatures')}
                    className={styles.button__select}
                >
                    Добавить места
                </button>

                <button
                    onClick={() => setInitial([], [])}
                    className={styles.button__remove}
                >
                    Очистить корзину
                </button>

            </div>
            {success && (
                <div className={styles.success}>Заказ создан</div>
            )}
            {errors.submit && (
                <p className={styles.form__error}>{errors.submit}</p>
            )}
        </>
    )
}