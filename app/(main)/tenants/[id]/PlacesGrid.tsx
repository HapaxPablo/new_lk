'use client'

import { CardNomenclature } from '@/components/ui/card/CardNomenclature'
import { useNomenclatureStore } from '@/store/useNomenclatureStore'
import { INomenclatureItem } from '@/types/nomenclature'
import { ITenantPlace } from '@/types/tenants'
import styles from './PlacesGrid.module.scss'

interface PlacesGridProps {
  places: ITenantPlace[]
  nomenclatures: INomenclatureItem[]
}

type TenantPlaceItem = INomenclatureItem & { nomenclatureId: string }

export function PlacesGrid({ places, nomenclatures }: PlacesGridProps) {
  const { ids, toggleAllItems } = useNomenclatureStore()
  const normalizedPlaces: TenantPlaceItem[] = places.flatMap((place) => {
    const nomenclature = nomenclatures.find(
      (item) => item.id === place.nomenclatureId
    )

    return nomenclature
      ? [{ ...nomenclature, nomenclatureId: place.nomenclatureId }]
      : []
  })
  const allSelected =
    normalizedPlaces.length > 0 &&
    normalizedPlaces.every((place) => ids.includes(place.id))

  if (!normalizedPlaces.length) {
    return (
      <p className="rounded-2xl bg-white px-5 py-8 text-center text-sm text-slate-500 ring-1 ring-slate-200">
        Места размещения пока не найдены.
      </p>
    )
  }

  return (
    <div className={styles.placesGrid}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500">
          Найдено: {normalizedPlaces.length}
        </p>
        <button
          type="button"
          onClick={() => toggleAllItems(normalizedPlaces)}
          className={`rounded-xl px-4 py-2 text-sm font-black transition ${
            allSelected
              ? 'bg-[#18335f] text-white hover:bg-[#12284c]'
              : 'bg-white text-[#18335f] ring-1 ring-slate-200 hover:ring-[#ef5350]'
          }`}
        >
          {allSelected ? 'Убрать все из заказа' : 'Выбрать все'}
        </button>
      </div>

      <div className="grid gap-5 overflow-y-auto md:grid-cols-2">
        {normalizedPlaces.map((place) => (
          <CardNomenclature key={place.nomenclatureId} item={place} />
        ))}
      </div>
    </div>
  )
}
