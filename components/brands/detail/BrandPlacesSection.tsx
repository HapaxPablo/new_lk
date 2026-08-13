import { BrandNomenclatures } from '@/components/brands/nomenclatures/BrandNomenclaturesWrapper'
import { EntityCard } from '@/components/ui/card/EntityCard'

interface BrandPlacesSectionProps {
  brandId: string
  brandName: string
}

export function BrandPlacesSection({
  brandId,
  brandName,
}: BrandPlacesSectionProps) {
  return (
    <section id="places" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
              Места размещения
            </div>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Где находятся точки бренда «{brandName}»
            </h2>
            <p className="mt-3 max-w-3xl text-slate-600">
              Список площадок бренда «{brandName}» с адресами, стоимостью и
              возможностью добавить нужные места в заказ.
            </p>
          </div>
        </div>

        <EntityCard tone="muted" className="p-4 md:p-6">
          <BrandNomenclatures brandId={brandId} />
        </EntityCard>
      </div>
    </section>
  )
}
