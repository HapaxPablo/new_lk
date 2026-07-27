'use client'

import { useSearchParams } from 'next/navigation'
import { useNomenclatureStore } from '@/store/useNomenclatureStore'
import { Button } from '@/components/ui/button/Button'
import { INomenclatureItem } from '@/types/nomenclature'
import styles from './SelectAllButton.module.scss'

interface SelectAllButtonProps {
    items: INomenclatureItem[]
}

export const SelectAllButton = ({ items }: SelectAllButtonProps) => {
    const searchParams = useSearchParams()
    const { toggleAllItems, ids, setInitial } = useNomenclatureStore()

    const hasFilters = !!(
        searchParams.get('search') ||
        searchParams.get('brand_name') ||
        searchParams.get('brand_id') ||
        searchParams.get('type_of_place')
    )

    const allSelected = items.length > 0 && items.every(item => ids.includes(item.id))
    const hasSelected = ids.length > 0

    // Если есть выбранные — приоритет у очистки корзины
    if (hasSelected) {
        return (
            <Button
                variant="error"
                onClick={() => setInitial([], [])}
            >
                Очистить корзину
            </Button>
        )
    }

    return (
        <div
            title={!hasFilters ? 'Чтобы активировать выберите что-то из фильтра, так как много точек для выбора' : ''}
        >
            <Button
                variant="add"
                onClick={() => toggleAllItems(items)}
                disabled={!hasFilters}
                isActive={allSelected && hasFilters}
            >
                {allSelected ? 'Убрать все из заказа' : 'Выбрать все'}
            </Button>
        </div>
    )
}