'use client'

import { useNomenclatureStore } from '@/store/useNomenclatureStore'
import { useBrandNomenclatures } from '@/hooks/useBrandNomenclatures'
import { CardNomenclature } from '@/components/ui/card/CardNomenclature'
import { Button } from '@/components/ui/button/Button'
import styles from './BrandNomenclaturesWrapper.module.scss'

interface Props {
    brandId: string
}

export const BrandNomenclatures = ({ brandId }: Props) => {
    const { items, totalCount, isLoadingInitial } =
        useBrandNomenclatures(brandId)

    const { ids, toggleAllItems } = useNomenclatureStore()

    if (isLoadingInitial) {
        return (
            <div className={styles.list}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={styles.skeleton} />
                ))}
            </div>
        )
    }

    if (!items.length) {
        return <p className={styles.empty}>Номенклатуры не найдены</p>
    }

    const handleSelectAll = () => {
        toggleAllItems(items)
    }

    const allSelected =
        items.length > 0 &&
        items.every((item) => ids.includes(item.id))

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <p className={styles.count}>
                    Всего: {totalCount}
                </p>

                <Button
                    variant="add"
                    onClick={handleSelectAll}
                    isActive={allSelected}
                >
                    {allSelected
                        ? 'Убрать все из заказа'
                        : 'Выбрать все'}
                </Button>
            </div>

            <div className={styles.list}>
                {items.map((item) => (
                    <CardNomenclature
                        key={item.id}
                        item={item}
                    />
                ))}
            </div>
        </div>
    )
}