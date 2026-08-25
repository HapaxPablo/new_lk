'use client'

import UnifiedMap from '@/components/maps/UnifiedMap'
import { toMapMarker } from '@/components/maps/adapters'
import Feedback from '@/components/ui/forms/feedback/Feedback'
import type { MapMarker } from '@/components/maps/types'
import type {
  INomenclatureItem,
  INomenclatureMapItem,
} from '@/types/nomenclature'
import useSWR from 'swr'
import { useNomenclatureFiltersStore } from '@/store/useNomenclatureFiltersStore'
import type { NomenclatureFilters } from '@/store/useNomenclatureFiltersStore'

interface CatalogSidebarProps {
  items: INomenclatureItem[]
  mapItems: INomenclatureMapItem[]
}

const RUSSIA_MAP_VIEW = {
  center: [100, 65] as [number, number],
  zoom: 3,
}

function getCatalogMapView(markers: MapMarker[]) {
  const coordinates = markers[0]?.coordinates
  if (!coordinates) {
    return RUSSIA_MAP_VIEW
  }

  return {
    center: coordinates,
    zoom: 10,
  }
}

function getMapRequestBody(filters: NomenclatureFilters) {
  const body: Record<string, string | boolean | string[]> = {}
  if (filters.search) body.search = filters.search
  if (filters.brand_id) {
    const ids = filters.brand_id.split(',').filter(Boolean)
    if (ids.length > 1) body.brand_ids = ids
    else body.brand_id = ids[0]
  }
  if (filters.counterparty_id) {
    const ids = filters.counterparty_id.split(',').filter(Boolean)
    if (ids.length > 1) body.counterparty_ids = ids
    else body.counterparty_id = ids[0]
  }
  if (filters.status) body.status = filters.status
  if (filters.type_of_place) body.type_of_place = filters.type_of_place
  if (filters.city_slug) body.city_slug = filters.city_slug
  if (filters.content_types) {
    body.content_types = filters.content_types.split(',').filter(Boolean)
  }
  if (filters.price_from) body.price_from = filters.price_from
  if (filters.price_to) body.price_to = filters.price_to
  if (filters.has_facade) body.has_facade = filters.has_facade === 'true'
  return body
}

export function CatalogSidebar({ items, mapItems }: CatalogSidebarProps) {
  const filters = useNomenclatureFiltersStore((state) => state.filters)
  const hasHydrated = useNomenclatureFiltersStore((state) => state.hasHydrated)
  const hasFilters = Object.keys(filters).length > 0
  const mapRequest =
    hasHydrated && hasFilters
      ? JSON.stringify(getMapRequestBody(filters))
      : null
  const {
    data: filteredMap,
    error: mapError,
    mutate: retryMap,
  } = useSWR<{
    count: number
    results: INomenclatureMapItem[]
  }>(mapRequest, async (body: string) => {
    const response = await fetch('/api/nomenclatures/map/', {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }
    return response.json()
  })
  const activeMapItems = hasFilters ? (filteredMap?.results ?? []) : mapItems
  const markers = activeMapItems
    .map(toMapMarker)
    .filter((marker): marker is MapMarker => marker !== null)
  const initialView = getCatalogMapView(markers)

  return (
    <aside className="space-y-5">
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-black text-slate-900">Карта площадок</h3>
          <p className="mt-1 text-sm text-slate-500">
            Выберите точку, чтобы увидеть её на карте.
          </p>
        </div>
        <div className="h-72 bg-slate-100">
          <UnifiedMap
            markers={markers}
            initialView={initialView}
            cluster
            fit="markers"
          />
        </div>
        {mapError && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3">
            <p role="alert" className="text-sm text-red-700">
              Не удалось обновить карту площадок.
            </p>
            <button
              type="button"
              onClick={() => retryMap()}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-900"
            >
              Повторить
            </button>
          </div>
        )}
      </section>

      <section
        id="brief"
        className="rounded-3xl bg-white p-2 shadow-sm ring-1 ring-slate-200"
      >
        <Feedback
          pathName="nomenclatures"
          nomenclaturesIds={items.map((item) => item.id)}
        />
      </section>

      <section className="rounded-3xl bg-[#18335f] p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-wider text-[#ffb0ae]">
          Поможем с выбором
        </p>
        <h3 className="mt-2 text-xl font-black">Нужна подборка площадок?</h3>
        <p className="mt-3 text-sm leading-6 text-white/75">
          Расскажите о задаче — предложим точки, форматы и ориентировочный
          бюджет размещения.
        </p>
      </section>
    </aside>
  )
}
