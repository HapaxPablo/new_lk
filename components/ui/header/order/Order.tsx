'use client'

import { useRouter } from 'next/navigation'
import styles from '../Header.module.scss'
import { ShoppingBasket } from 'lucide-react'
import { MouseEvent } from 'react'
import { useNomenclatureStore } from '@/store/useNomenclatureStore'

export default function Order() {
    const itemCount = useNomenclatureStore((state) => state.items.length)
    const router = useRouter()
    const handleRedirectToOrder = (e: MouseEvent) => {
        e.preventDefault()
        router.push('/order')
    }
    return (
        <div className={styles.basket_wrapper} onClick={handleRedirectToOrder}>
            <ShoppingBasket
                size={32}
            />
            <div className={styles.basket_wrapper__count}>{itemCount}</div>
        </div>
    )
}
