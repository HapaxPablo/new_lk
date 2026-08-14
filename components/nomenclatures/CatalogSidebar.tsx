'use client'

import PlacesSimpleMap from '@/app/(main)/places/components/PlacesSimpleMap'
import Feedback from '@/components/ui/forms/feedback/Feedback'
import type { ICity } from '@/types/cities'
import type { INomenclatureItem } from '@/types/nomenclature'

interface CatalogSidebarProps {
  items: INomenclatureItem[]
  cityName?: string
}

const RUSSIA_MAP_VIEW = {
  center: [100, 65] as [number, number],
  zoom: 3,
}

function getCatalogMapView(places: ICity[]) {
  const coordinates = places[0]?.formattedAddress.coordinates
  const latitude = Number.parseFloat(coordinates?.latitude ?? '')
  const longitude = Number.parseFloat(coordinates?.longitude ?? '')

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return RUSSIA_MAP_VIEW
  }

  return {
    center: [longitude, latitude] as [number, number],
    zoom: 10,
  }
}

function toMapPlace(item: INomenclatureItem): ICity {
  const address =
    typeof item.formattedAddress === 'string'
      ? {
          name: item.formattedAddress,
          coordinates: { latitude: null, longitude: null },
        }
      : item.formattedAddress

  return {
    id: item.id,
    nomenclatureSlug: item.oldCatalogSlug || item.id,
    title: item.name || item.brand?.name,
    formattedAddress: address,
    pricePerMonth: item.pricePerMonth,
    typeOfPlace:
      typeof item.typeOfPlace === 'string'
        ? item.typeOfPlace
        : item.typeOfPlace?.name || '',
    exterior: item.exterior.map((image, index) => ({
      source: image.source,
      id: `${item.id}-${index}`,
    })),
    brand: {
      id: item.brand?.id || '',
      name: item.brand?.name || 'Рекламная площадка',
      logotype: item.brand?.logotype || '',
      slug: item.brand?.slug || '',
    },
  }
}

export function CatalogSidebar({ items, cityName }: CatalogSidebarProps) {
  const places = items.map(toMapPlace)
  const initialView = getCatalogMapView(places)

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
          <PlacesSimpleMap
            places={places}
            cityName={cityName || 'Рекламные площадки'}
            initialView={initialView}
            minZoom={3}
            markerScale={0.4}
          />
        </div>
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
