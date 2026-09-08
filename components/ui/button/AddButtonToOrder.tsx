'use client'

import { useNomenclatureStore } from "@/store/useNomenclatureStore"
import { Button } from "./Button"
import { INomenclatureBase } from "@/types/nomenclature"

export function AddButtonToOrder({ item }: { item: INomenclatureBase }) {
    const { toggle, ids } = useNomenclatureStore()
    const handleAdd = () => toggle(item)
    const isSelected = ids.includes(item.id)
    return (
        <Button onClick={handleAdd}>
            {isSelected ? 'Убрать из заказа' : 'Разместить ролик'}
        </Button>
    )
}
