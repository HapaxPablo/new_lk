'use client'

import { useRouter } from 'next/navigation'
import styles from '../Header.module.scss'
import { ShoppingBasket } from 'lucide-react'
import { useNomenclatureStore } from '@/store/useNomenclatureStore'

export default function Order() {
  const itemCount = useNomenclatureStore((state) => state.ids.length)
  const router = useRouter()

  return (
    <button
      type="button"
      className={styles.basket_wrapper}
      aria-label={`Перейти к оформлению заказа: выбрано мест — ${itemCount}`}
      onClick={() => router.push('/order')}
    >
      <ShoppingBasket size={32} aria-hidden="true" />
      <span className={styles.basket_wrapper__count}>{itemCount}</span>
    </button>
  )
}
