// components/nomenclatureById/detail/SimilarPlacements.tsx
import { CardNomenclature } from '@/components/ui/card/CardNomenclature'
import { INomenclatureItem } from '@/types/nomenclature'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface SimilarPlacementsProps {
  places: INomenclatureItem[]
  typeOfPlace?: string
  citySlug?: string
}

export function SimilarPlacements({
  places,
  typeOfPlace,
  citySlug,
}: SimilarPlacementsProps) {
  if (!places.length) return null

  const params = new URLSearchParams()
  if (typeOfPlace) params.set('type_of_place', typeOfPlace)
  if (citySlug) params.set('city_slug', citySlug)
  const allPlacementsHref = `/nomenclatures?${params.toString()}`

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
              Похожие площадки
            </div>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Другие места для рекламы
            </h2>
            <p className="mt-3 text-slate-600">
              Подборка помогает сравнить похожие площадки и собрать более
              широкий медиаплан.
            </p>
          </div>

          <Link
            href={allPlacementsHref}
            className="text-sm font-black text-[#ef5350] hover:text-[#d83c39]"
          >
            Все площадки →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {places.slice(0, 5).map((place) => (
            <CardNomenclature key={place.id} item={place} />
          ))}
          <Link
            href={allPlacementsHref}
            className="group flex min-h-72 flex-col items-center justify-center rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
              Все площадки
            </span>
            <span className="mt-2 flex items-center gap-2 text-xl font-black text-slate-900">
              Просмотреть ещё
              <ArrowRight
                size={22}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
