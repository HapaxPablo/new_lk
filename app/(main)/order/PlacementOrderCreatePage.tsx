'use client'

import { CardNomenclature } from "@/components/ui/card/CardNomenclature";
import { useEffect, useState } from "react";
import { useNomenclatureStore } from "@/store/useNomenclatureStore";
import Link from "next/link";

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
    initialItems: any[]
    initialIds: string[]
}) {
    const {
        ids,
        items,
        setInitial,
        getTotalPrice,
    } = useNomenclatureStore()
    const itemCount = useNomenclatureStore((state) => state.items.length)
    const totalPrice = getTotalPrice()

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const [form, setForm] = useState<FormState>({
        duration: "30",
        all_days: true,
        days_of_week: [],
    });

    console.log('Initial Items:', initialItems)

    // 🚀 HYDRATION (SSR → store)
    useEffect(() => {
        setInitial(initialIds, initialItems)
    }, [initialIds, initialItems])

    const toggleDay = (key: string) => {
        setForm((prev) => ({
            ...prev,
            days_of_week: prev.days_of_week.includes(key)
                ? prev.days_of_week.filter((d) => d !== key)
                : [...prev.days_of_week, key],
        }));
    };

    const validate = (): boolean => {
        const e: FormErrors = {};

        if (!form.duration || Number(form.duration) < 1)
            e.duration = "Укажите кол-во дней (минимум 1)";

        if (!form.all_days && form.days_of_week.length === 0)
            e.days_of_week = "Выберите хотя бы один день недели";

        if (ids.length === 0)
            e.nomenclature_ids = "Выберите хотя бы одно место размещения";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const days = Number(form.duration) || 0
    const finalPrice = totalPrice * days

    const handleSubmit = async () => {
        if (!validate()) return;

        setSubmitting(true);
        setErrors({});
        setSuccess(false);

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
            });

            if (!res.ok) {
                const data = await res.json();
                const msg =
                    data?.days_of_week?.[0] ??
                    data?.nomenclature_ids?.[0] ??
                    data?.detail ??
                    "Ошибка при создании заказа";

                setErrors({ submit: msg });
                return;
            }

            setSuccess(true);

            setForm({
                duration: "",
                all_days: true,
                days_of_week: [],
            });
            setInitial([], [])

        } catch {
            setErrors({ submit: "Нет соединения с сервером" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="overflow-auto h-full">

            <meta name="description" content="Страница оформления заказа на размещение ролика" />
            <meta name="keywords" content="оформление заказа, размещение ролика, выбор мест размещения, продолжительность, дни недели, общая сумма" />
            <div className="w-full flex items-center justify-center px-8 py-6 border-b">
                <h1 className="text-xl font-bold">Оформление заказа на размещение ролика</h1>
            </div>
            <div className={`grid ${itemCount > 3
                ? 'md:grid-cols-[1fr_400px]'
                : 'md:grid-cols-[3fr_640px]'
                } px-8 py-10 gap-8`}
            >

                {/* LEFT */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-xs uppercase text-gray-500 tracking-widest">
                            Места размещения
                        </span>

                        {ids.length > 0 && (
                            <span className="text-xs text-gray-400">
                                Выбрано: {ids.length}
                            </span>
                        )}
                    </div>

                    {errors.nomenclature_ids && (
                        <p className="text-xs text-red-500">
                            {errors.nomenclature_ids}
                        </p>
                    )}

                    <div className="md:max-h-[640] max-h-[280] overflow-y-auto p-2 flex flex-row flex-wrap gap-2">
                        {itemCount === 0 && (
                            <div className="text-sm text-gray-500">
                                Нет выбранных мест размещения
                            </div>
                        )}
                        {items.map((item) => (
                            <CardNomenclature
                                key={item.id}
                                item={item}
                            />
                        ))}

                    </div>

                </div>

                {/* RIGHT */}
                <div className="space-y-4 w-full">

                    {/* Duration */}
                    <div className="space-y-2">
                        <label className="text-xs tracking-widest text-gray-500 uppercase block">
                            Количество дней
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={form.duration}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    duration: e.target.value,
                                }))
                            }
                            className="w-full border
                             border-gray-200 rounded-lg
                             px-4 py-2.5 text-sm
                              text-gray-700 placeholder-gray-300
                              outline-none focus:border-gray-400
                              focus:ring-1 focus:ring-gray-100 transition-all
                               bg-white shadow-sm"
                        />
                        {errors.duration && (
                            <p className="text-xs text-red-500">{errors.duration}</p>
                        )}
                    </div>

                    {/* Days */}
                    <div className="space-y-3">
                        <label className="text-xs tracking-widest text-gray-500 uppercase">
                            Дни размещения
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.all_days}
                                onChange={() =>
                                    setForm((p) => ({
                                        ...p,
                                        all_days: !p.all_days,
                                        days_of_week: [],
                                    }))
                                }
                                className="hidden peer"
                            />
                            <div className="w-4 h-4 border rounded peer-checked:bg-orange-400" />
                            <span className="text-sm text-gray-600">
                                {form.all_days ? "Все дни недели" : "Выбрать дни"}
                            </span>
                        </label>

                        {!form.all_days && (
                            <div className="grid grid-cols-7 gap-1">
                                {DAYS.map((d) => {
                                    const active = form.days_of_week.includes(d.key)

                                    return (
                                        <button
                                            key={d.key}
                                            type="button"
                                            onClick={() => toggleDay(d.key)}
                                            className={`text-xs p-2 border rounded ${active ? "bg-black text-white" : ""
                                                }`}
                                        >
                                            {d.label}
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        {errors.days_of_week && (
                            <p className="text-xs text-red-500">
                                {errors.days_of_week}
                            </p>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="text-xs text-gray-500 space-y-1">
                        <div>Выбрано мест: {ids.length}</div>
                        <div>
                            Дней: {form.duration || "—"}
                        </div>
                    </div>

                    <div className="flex flex-col justify-start items-start gap-1">
                        <div className="flex flex-row gap-2 items-center">
                            <span >Общая сумма </span>
                            <span className="font-semibold">
                                {finalPrice.toLocaleString('ru-RU')} ₽
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">
                            {totalPrice.toLocaleString('ru-RU')} ₽ × {days || '—'} дней
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full bg-black text-white py-3 rounded-lg"
                    >
                        {submitting ? "Отправка..." : "Создать заказ"}
                    </button>

                    <Link href="/nomenclatures">
                        <span className="text-primary">Выбрать места</span>
                    </Link>

                    {success && (
                        <div className="text-green-600 text-sm">
                            Заказ создан
                        </div>
                    )}

                    {errors.submit && (
                        <div className="text-red-500 text-sm">
                            {errors.submit}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}