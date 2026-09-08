'use client'

import { useMemo, useState } from 'react'
import { CardNomenclature } from '@/components/ui/card/CardNomenclature'
import { ICity } from '@/types/cities'
import styles from './PlacesListing.module.scss'
import { EntityCard } from '@/components/ui/card/EntityCard'
import UnifiedMap, { MapMarker } from '@/components/maps/UnifiedMap'
import { toMapMarker } from '@/components/maps/adapters'

interface PlacesListingProps {
  cityName: string
  places: ICity[]
}

export function PlacesListing({ cityName, places }: PlacesListingProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const markers = useMemo(
    () =>
      places
        .map(toMapMarker)
        .filter((marker): marker is MapMarker => marker !== null),
    [places]
  )
  return (
    <section id="places" className="border-y bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              Площадки для рекламы в {cityName}
            </h2>
            <p className="mt-2 text-slate-600">
              Выберите торговый центр или оставьте заявку — менеджер предложит
              оптимальные точки под вашу задачу.
            </p>
          </div>

          <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
            Найдено:{' '}
            <span className="text-[#ef5350]">{places.length} площадок</span>
          </div>
        </div>

        <EntityCard className="mb-8 rounded-2xl p-4">
          <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
            <input
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#ef5350]"
              placeholder="Поиск по ТЦ или адресу"
            />
            <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500 outline-none focus:border-[#ef5350]">
              <option>Формат рекламы</option>
              <option>Аудиореклама</option>
              <option>Видеореклама</option>
              <option>Аудио + видео</option>
            </select>
            <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500 outline-none focus:border-[#ef5350]">
              <option>Бюджет</option>
              <option>До 5 000 ₽</option>
              <option>5 000–15 000 ₽</option>
              <option>От 15 000 ₽</option>
            </select>
            <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500 outline-none focus:border-[#ef5350]">
              <option>Район города</option>
              <option>Центр</option>
              <option>Юго-Восточный</option>
            </select>
            <button className="rounded-xl bg-[#18335f] px-5 py-3 text-sm font-bold text-white hover:bg-[#12284c]">
              Найти
            </button>
          </div>
        </EntityCard>

        {/* <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]"> */}
        {/* <aside className="lg:sticky lg:top-24 lg:self-start"> */}
        <div className="flex flex-col gap-8">
          <EntityCard className="p-0">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <div className="font-black text-slate-900">Карта площадок</div>
                <div className="text-sm text-slate-500">
                  ТЦ и рекламные точки в {cityName}
                </div>
              </div>
            </div>
            <div className="relative h-80 bg-slate-200">
              <UnifiedMap
                markers={markers}
                selectedMarkerId={selectedPlaceId}
                onMarkerSelect={setSelectedPlaceId}
                cluster
                fit="markers"
              />
            </div>
            <div className={styles.cardList}>
              <div className={styles.cardGrid}>
                {places.map((place, index) => (
                  <CardNomenclature key={index} item={place} />
                ))}
              </div>
            </div>
          </EntityCard>
          {/* </aside> */}
        </div>
      </div>

      <div className="mt-8 text-center">
        <button className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 hover:border-[#ef5350] hover:text-[#ef5350]">
          Показать ещё площадки
        </button>
      </div>
      {/* </div> */}
    </section>
  )
}
