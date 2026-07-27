'use client'

import { useEffect, useState } from 'react'
import { Button } from '../button/Button'
import { useNomenclatureStore } from '@/store/useNomenclatureStore'
import { useUniversalClick } from '@/hooks/useUniversalClick'

interface AddToCartButtonProps {
    item: any
    isSelected?: boolean
}

export const AddToCartButton = ({
    item,
    isSelected: externalIsSelected,
}: AddToCartButtonProps) => {
    const [mounted, setMounted] = useState(false)

    const { ids, toggle } = useNomenclatureStore()
    const handleUniversalClick = useUniversalClick()

    useEffect(() => {
        setMounted(true)
    }, [])

    const isSelected =
        externalIsSelected !== undefined
            ? externalIsSelected
            : mounted && ids.includes(item.id)

    const handleAdd = () => {
        toggle(item)
    }

    return (
        <Button
            variant="add"
            onClick={(e) => handleUniversalClick(handleAdd, e)}
            isActive={isSelected}
        >
            {isSelected
                ? 'Убрать из заказа'
                : 'Разместить ролик'}
        </Button>
    )
}