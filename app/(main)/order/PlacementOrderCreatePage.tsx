'use client'

import { useEffect, useRef, useState } from 'react'
import { useNomenclatureStore } from '@/store/useNomenclatureStore'
import { INomenclatureItem } from '@/types/nomenclature'
import ModalFeedBack from '@/components/nomenclatureById/modalFeedBack/ModalFeedBack'
import styles from './OrderCreate.module.scss'
import { useDateRange } from '@/hooks/useDateRange'
import { useOrderSubmit } from '@/hooks/useOrderSubmit'
import { OrderCreateContext } from '@/providers/order/OrderCreateContext'
import { PlacementsList } from '@/components/order/PlacementsList'
import { DateRangePicker } from '@/components/order/DateRangePicker'
import { DaysOfWeekPicker } from '@/components/order/DaysOfWeekPicker'
import { OrderSummary } from '@/components/order/OrderSummary'
import { useModal } from '@/providers/modal/ModalProvider'
import { ModalWrapper } from '@/components/modal/ModalWrapper'
import { LoginFormMobile } from '@/components/auth/login/mobile/LoginFormMobile'
import { useAuth } from '@/providers/auth-provider/AuthProvider'

export default function PlacementOrderCreatePage({
    initialItems,
    initialIds,
}: {
    initialItems: INomenclatureItem[]
    initialIds: string[]
}) {
    const { setInitial } = useNomenclatureStore()
    const initialized = useRef(false)
    const [mounted, setMounted] = useState(false)

    const { isAuthenticated } = useAuth()
    const { openModal: openAuthModal, closeModal: closeAuthModal } = useModal('auth')
    const authRetryPending = useRef(false)

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true
        setInitial(initialIds, initialItems)
    }, [])

    useEffect(() => { setMounted(true) }, [])

    const dateRange = useDateRange()
    const order = useOrderSubmit(
        dateRange.parsedStartRef,
        dateRange.parsedEndRef,
        dateRange.reset,
        () => {
            authRetryPending.current = true
            openAuthModal()
        },
    )

    useEffect(() => {
        order.setForm((prev) => ({ ...prev, duration: String(dateRange.days) }))
    }, [dateRange.days])

    useEffect(() => {
        if (isAuthenticated && authRetryPending.current) {
            authRetryPending.current = false
            closeAuthModal()
            order.retrySubmit()
        }
    }, [isAuthenticated])


    return (
        <OrderCreateContext.Provider value={{ dateRange, order, mounted }}>
            <div className={styles.page}>
                <div className={styles.header}>
                    <h1 className={styles.header__title}>
                        Оформление заказа на размещение ролика
                    </h1>
                </div>

                <div className={`${styles.grid} ${styles['grid--few']}`}>
                    <PlacementsList />

                    <div className={styles.form}>
                        <DateRangePicker />
                        <DaysOfWeekPicker />
                        <OrderSummary />
                        <ModalFeedBack
                            pathName="order"
                            nomenclaturesIds={initialIds}
                        />
                    </div>
                </div>
            </div>
            <ModalWrapper id="auth" title="Авторизация">
                <LoginFormMobile />
            </ModalWrapper>
        </OrderCreateContext.Provider>
    )
}