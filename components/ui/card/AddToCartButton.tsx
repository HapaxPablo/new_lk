'use client'

import { useEffect, useState } from 'react'
import { Button } from '../button/Button'
import { useNomenclatureStore } from '@/store/useNomenclatureStore'
import { useUniversalClick } from '@/hooks/useUniversalClick'

interface AddToCartButtonProps {
    item: any
    isSelected?: boolean
    className?: string
    addLabel?: string
    selectedLabel?: string
}

export const AddToCartButton = ({
    item,
    isSelected: externalIsSelected,
    className = '',
    addLabel = 'Разместить ролик',
    selectedLabel = 'Убрать из заказа',
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
            variant="cardAction"
            onClick={(e) => handleUniversalClick(handleAdd, e)}
            isActive={isSelected}
            className={className}
        >
            {isSelected
                ? selectedLabel
                : addLabel}
        </Button>
    )
}
