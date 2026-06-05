'use client'

import { Button } from '../button/Button'
import { useNomenclatureStore } from '@/store/useNomenclatureStore'
import { useUniversalClick } from '@/hooks/useUniversalClick'

interface AddToCartButtonProps {
    item: any
    isSelected?: boolean
}

export const AddToCartButton = ({ item, isSelected: externalIsSelected }: AddToCartButtonProps) => {
    const { ids, toggle } = useNomenclatureStore()
    const handleUniversalClick = useUniversalClick()

    // Если isSelected не передан извне, получаем из стора
    const isSelected = externalIsSelected !== undefined ? externalIsSelected : ids.includes(item.id)

    const handleAdd = () => toggle(item) // передаём объект с id, либо сам item

    return (
        <Button
            variant="add"
            onClick={(e) => handleUniversalClick(handleAdd, e)}
            isActive={isSelected}
        >
            {isSelected ? 'Убрать из заказа' : 'Разместить ролик'}
        </Button>
    )
}