'use client'

import { CardNomenclature } from '@/components/ui/card/CardNomenclature'
import { ITenantPlace } from '@/types/tenants'
import { useNomenclatureStore } from '@/store/useNomenclatureStore'
import { Button } from '@/components/ui/button/Button'
import styles from './PlacesGrid.module.scss'
import { INomenclatureItem } from '@/types/nomenclature'

interface PlacesGridProps {
    places: ITenantPlace[]
    nomenclatures: INomenclatureItem[]
}


export function PlacesGrid({ places, nomenclatures }: PlacesGridProps) {

    const { ids, toggleAllItems } = useNomenclatureStore()

    const normalizedPlaces = places.map((place) => {
        const nomenclature = nomenclatures.find(
            (n) => n.id === place.nomenclatureId
        )
        return {
            ...nomenclature,
            ...place,
            id: place.nomenclatureId,
        }
    })

    const allSelected =
        normalizedPlaces.length > 0 &&
        normalizedPlaces.every((place) => ids.includes(place.id))

    const handleSelectAll = () => {
        toggleAllItems(normalizedPlaces)
    }

    // const handleRedirect = (id: string) => {
    //     window.open(`/nomenclatures/${id}`, '_blank')
    // }

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <span className={styles.count}>Всего: {places.length}</span>
                <Button
                    variant="add"
                    onClick={handleSelectAll}
                    isActive={allSelected}
                >
                    {allSelected ? 'Убрать все из заказа' : 'Выбрать все'}
                </Button>
            </div>

            <div className={styles.grid}>
                {normalizedPlaces.map((place) => (
                    <CardNomenclature
                        key={place.nomenclatureId}
                        item={place}
                    // onClick={() => handleRedirect(place.nomenclatureId)}
                    />
                ))}
            </div>
        </div>
    )
}