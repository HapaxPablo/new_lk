'use client'

import { CardNomenclature } from "@/components/ui/card/CardNomenclature";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNomenclatureStore } from "@/store/useNomenclatureStore";
import styles from "./OrderCreate.module.scss";
import { INomenclatureItem } from "@/types/nomenclature";
import { useRouter } from "next/navigation";

const DAYS = [
    { key: "mon", label: "Пн" },
    { key: "tue", label: "Вт" },
    { key: "wed", label: "Ср" },
    { key: "thu", label: "Чт" },
    { key: "fri", label: "Пт" },
    { key: "sat", label: "Сб" },
    { key: "sun", label: "Вс" },
];

interface FormState {
    duration: string;
    all_days: boolean;
    days_of_week: string[];
}

interface FormErrors {
    duration?: string;
    days_of_week?: string;
    nomenclature_ids?: string;
    submit?: string;
}

export default function PlacementOrderCreatePage({
    initialItems,
    initialIds,
}: {
    initialItems: INomenclatureItem[]
    initialIds: string[]
}) {
    const router = useRouter()
    const { ids, items, setInitial } = useNomenclatureStore()
    const itemCount = useNomenclatureStore((state) => state.items.length)
    const totalPrice = useNomenclatureStore((state) => state.getTotalPrice())
    const [mounted, setMounted] = useState(false)


    const initialized = useRef(false)

    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [form, setForm] = useState<FormState>({
        duration: "30",
        all_days: true,
        days_of_week: [],
    })

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true

        setInitial(initialIds, initialItems)
    }, [])

    const toggleDay = (key: string) => {
        setForm((prev) => ({
            ...prev,
            days_of_week: prev.days_of_week.includes(key)
                ? prev.days_of_week.filter((d) => d !== key)
                : [...prev.days_of_week, key],
        }))
    }

    const validate = (): boolean => {
        const e: FormErrors = {}
        if (!form.duration || Number(form.duration) < 1)
            e.duration = "Укажите кол-во дней (минимум 1)"
        if (!form.all_days && form.days_of_week.length === 0)
            e.days_of_week = "Выберите хотя бы один день недели"
        if (ids.length === 0)
            e.nomenclature_ids = "Выберите хотя бы одно место размещения"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const days = Number(form.duration) || 0
    const finalPrice = totalPrice * days

    const handleSubmit = async () => {
        if (!validate()) return
        setSubmitting(true)
        setErrors({})
        setSuccess(false)

        try {
            const res = await fetch("/api/order/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    duration: Number(form.duration),
                    all_days: form.all_days,
                    days_of_week: form.all_days ? [] : form.days_of_week,
                    nomenclature_ids: ids,
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                const msg =
                    data?.days_of_week?.[0] ??
                    data?.nomenclature_ids?.[0] ??
                    data?.detail ??
                    "Ошибка при создании заказа"
                setErrors({ submit: msg })
                return
            }

            setSuccess(true)
            setForm({ duration: "", all_days: true, days_of_week: [] })
            setInitial([], [])

        } catch {
            setErrors({ submit: "Нет соединения с сервером" })
        } finally {
            setSubmitting(false)
        }
    }

    const { startDate, endDate } = useMemo(() => {
        const start = new Date()
        start.setDate(start.getDate() + 2)
        const end = new Date(start)
        end.setDate(start.getDate() + days)
        return { startDate: start, endDate: end }
    }, [days])

    const formatDate = (date: Date) =>
        date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.header__title}>
                    Оформление заказа на размещение ролика
                </h1>
            </div>

            <div className={`${styles.grid} ${styles['grid--few']}`}>

                {/* LEFT */}
                <div className={styles.placements}>
                    <div className={styles.placements__header}>
                        <span className={styles.placements__label}>Места размещения</span>
                        {ids.length > 0 && (
                            <span className={styles.placements__count}>Выбрано: {ids.length}</span>
                        )}
                    </div>

                    {errors.nomenclature_ids && (
                        <p className={styles.placements__error}>{errors.nomenclature_ids}</p>
                    )}

                    <div className={styles.placements__list}>
                        {itemCount === 0 && (
                            <div className={styles.placements__empty}>
                                Нет выбранных мест размещения
                            </div>
                        )}
                        {items.map((item) => (
                            <CardNomenclature key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                {/* RIGHT */}
                <div className={styles.form}>

                    {/* Duration */}
                    <div className={styles.form__group}>
                        <label className={styles.form__label}>Количество дней</label>
                        <input
                            type="number"
                            min={1}
                            value={form.duration}
                            onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                            className={styles.form__input}
                        />
                        {errors.duration && (
                            <p className={styles.form__error}>{errors.duration}</p>
                        )}
                    </div>

                    {/* Days */}
                    <div className={styles.days}>
                        <label className={styles.form__label}>Дни размещения</label>

                        <label className={styles.days__checkbox}>
                            <input
                                type="checkbox"
                                checked={form.all_days}
                                onChange={() => setForm((p) => ({ ...p, all_days: !p.all_days, days_of_week: [] }))}
                            />
                            <div className={styles.days__box} />
                            <span className={styles.days__text}>
                                {form.all_days ? "Все дни недели" : "Выбрать дни"}
                            </span>
                        </label>

                        {!form.all_days && (
                            <div className={styles.days__grid}>
                                {DAYS.map((d) => (
                                    <button
                                        key={d.key}
                                        type="button"
                                        onClick={() => toggleDay(d.key)}
                                        className={`${styles.days__day} ${form.days_of_week.includes(d.key) ? styles['days__day--active'] : ''}`}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {errors.days_of_week && (
                            <p className={styles.form__error}>{errors.days_of_week}</p>
                        )}
                    </div>

                    {/* Summary */}
                    <div className={styles.summary} suppressHydrationWarning>
                        <div>Выбрано мест: {mounted ? ids.length : '0'}</div>
                        <div>Дней: {form.duration || "—"}</div>
                    </div>

                    <div className={styles.summary__total}>
                        <span>Общая сумма</span>
                        <span className={styles.summary__amount} suppressHydrationWarning>
                            {mounted ? finalPrice.toLocaleString('ru-RU') : '0'} ₽
                        </span>
                    </div>

                    <div className={styles.summary__breakdown} suppressHydrationWarning>
                        {mounted ? totalPrice.toLocaleString('ru-RU') : '0'} ₽ × {days || '—'} дней
                    </div>

                    <div className={styles.summary__dates} suppressHydrationWarning>
                        <div>Старт: {formatDate(startDate)}</div>
                        <div>Окончание: {days ? formatDate(endDate) : "—"}</div>
                    </div>

                    {/* Buttons */}
                    <div className={styles.button}>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className={styles.button__create}
                        >
                            {submitting ? "Отправка..." : "Создать заказ"}
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

                        {success && (
                            <div className={styles.success}>Заказ создан</div>
                        )}
                        {errors.submit && (
                            <p className={styles.form__error}>{errors.submit}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}