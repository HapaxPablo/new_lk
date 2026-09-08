'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import Feedback from '@/components/ui/forms/feedback/Feedback'
import { Skeleton } from '@/components/ui/skeleton'
import { INomenclatureMapPointResponse } from '@/types/nomenclature'
import { useNomenclatureFiltersStore } from '@/store/useNomenclatureFiltersStore'
import type { NomenclatureFilters } from '@/store/useNomenclatureFiltersStore'
import { toMapMarker } from '../maps/adapters'

// Карта — тяжёлый клиентский чанк (Yandex/MapLibre). Импортируем лениво
// и только на клиенте: первичный HTML страницы без карты.
const UnifiedMap = dynamic(() => import('../maps/UnifiedMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
})

interface CatalogSidebarProps {
  /** id элементов текущей страницы — нужны только для формы обратной связи */
  nomenclatureIds: string[]
}

const CATALOG_MAP_VIEW = {
  center: [92.87, 56.01] as [number, number],
  zoom: 4,
}

function getMapRequestBody(filters: NomenclatureFilters) {
  const body: Record<string, string | boolean | string[]> = {}
  if (filters.search) body.search = filters.search
  if (filters.brand_name) body.brand_name = filters.brand_name
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

/**
 * Карта каталога: грузится, когда секция стала видимой.
 * Сбой запроса карты показывает ошибку с повтором, но не трогает каталог.
 */
function CatalogMapSection({ mapKey }: { mapKey: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = containerRef.current
    if (!node || visible) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
        }
      },
      { rootMargin: '400px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [visible])

  const { data, error, isLoading, mutate } =
    useSWR<INomenclatureMapPointResponse>(
      visible ? mapKey : null,
      async (key: string) => {
        const response = await fetch('/api/nomenclatures/map/', {
          method: 'POST',
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
          body: key,
        })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        return response.json()
      },
      { revalidateOnFocus: false }
    )
  const markers = (data?.results ?? [])
    .map((point) =>
      toMapMarker({
        id: point.id,
        title: point.title,
        nomenclatureSlug: point.slug,
        coordinates: point.coordinates ?? undefined,
        brand: {
          name: point.brand?.name ?? undefined,
          logotype: point.brand?.logotype ?? undefined,
        },
        facade: {
          source: point.facade?.source ?? undefined,
        },
      })
    )

    .filter((marker) => marker !== null)

  return (
    <div ref={containerRef} className="h-full w-full bg-slate-100">
      {visible && error ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-sm text-slate-500">
            Не удалось загрузить карту. Каталог работает, попробуйте ещё раз.
          </p>
          <button
            type="button"
            onClick={() => mutate()}
            className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-slate-700"
          >
            Повторить
          </button>
        </div>
      ) : visible && isLoading ? (
        <Skeleton className="h-full w-full" />
      ) : visible ? (
        <UnifiedMap
          markers={markers}
          initialView={CATALOG_MAP_VIEW}
          cluster
          fit="none"
        />
      ) : null}
    </div>
  )
}

export function CatalogSidebar({ nomenclatureIds }: CatalogSidebarProps) {
  const filters = useNomenclatureFiltersStore((state) => state.filters)
  const hasHydrated = useNomenclatureFiltersStore((state) => state.hasHydrated)

  // Без фильтров тело пустое — карта показывает все точки
  const mapKey = hasHydrated ? JSON.stringify(getMapRequestBody(filters)) : null

  return (
    <aside className="space-y-5">
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-black text-slate-900">Карта площадок</h3>
          <p className="mt-1 text-sm text-slate-500">
            Выберите точку, чтобы увидеть её на карте.
          </p>
        </div>
        <div className="h-125 bg-slate-100">
          <CatalogMapSection mapKey={mapKey} />
        </div>
      </section>

      <section
        id="brief"
        className="rounded-3xl bg-white p-2 shadow-sm ring-1 ring-slate-200"
      >
        <Feedback pathName="nomenclatures" nomenclaturesIds={nomenclatureIds} />
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
