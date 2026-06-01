'use client'

import { useRef, useEffect } from 'react'
import { useBrandNomenclatures } from '@/hooks/useBrandNomenclatures'
import styles from './BrandNomenclaturesWrapper.module.scss'
import { CardNomenclature } from '@/components/ui/card/CardNomenclature'
import { useNomenclatureStore } from '@/store/useNomenclatureStore'
import { Button } from '@/components/ui/button/Button'

interface Props {
    brandId: string
}

export const BrandNomenclatures = ({ brandId }: Props) => {
    const { items, totalCount, hasMore, isLoadingInitial, isLoadingMore, setSize, size } =
        useBrandNomenclatures(brandId)
    const loaderRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    const { ids, toggleAllItems } = useNomenclatureStore()

    useEffect(() => {
        const loader = loaderRef.current
        if (!loader) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    setSize((s) => s + 1)
                }
            },
            {
                root: null,
                threshold: 0.1,
            }
        )
        observer.observe(loader)
        return () => observer.disconnect()
    }, [hasMore, isLoadingMore, setSize])

    if (isLoadingInitial) {
        return (
            <div className={styles.list} ref={listRef}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={styles.skeleton} />
                ))}
            </div>
        )
    }

    if (!items.length) {
        return <p className={styles.empty}>Номенклатуры не найдены</p>
    }

    // const handleRedirect = (id: string) => {
    //     window.open(`/nomenclatures/${id}`, '_blank');
    // }

    // Новый обработчик для выбрать все
    const handleSelectAll = () => {
        toggleAllItems(items)
    }

    // Проверяем, все ли элементы выбраны
    const allSelected = items.length > 0 && items.every(item => ids.includes(item.id))

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <p className={styles.count}>Всего: {totalCount}</p>
                <Button
                    variant="add"
                    onClick={handleSelectAll}
                    isActive={allSelected}
                >
                    {allSelected ? 'Убрать все из заказа' : 'Выбрать все'}
                </Button>
            </div>
            <div className={styles.list} ref={listRef}>
                {items.map((item) => (
                    <CardNomenclature key={item.id} item={item} />
                ))}
                <div ref={loaderRef} className={styles.loader}>
                    {isLoadingMore && <span>Загрузка...</span>}
                </div>
            </div>
        </div>
    )
}