// components/nomenclatureById/detail/SimilarPlacements.tsx
import { CardNomenclature } from '@/components/ui/card/CardNomenclature'
import { INomenclatureItem } from '@/types/nomenclature'
import Link from 'next/link'

interface SimilarPlacementsProps {
  places: INomenclatureItem[]
}

export function SimilarPlacements({ places }: SimilarPlacementsProps) {
  if (!places.length) return null

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
            href="/nomenclatures"
            className="text-sm font-black text-[#ef5350] hover:text-[#d83c39]"
          >
            Все площадки →
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          {places.map((place) => (
            <CardNomenclature key={place.id} item={place} />
          ))}
        </div>
      </div>
    </section>
  )
}
