import { EntityCard } from '@/components/ui/card/EntityCard'

interface AudienceProps {
  cityName: string
}

export function Audience({ cityName }: AudienceProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="text-center">
          <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">Для кого</div>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Кому подходит размещение indoor-рекламы в {cityName}
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <EntityCard className="rounded-2xl p-5">
            <h3 className="font-black">Ритейл и магазины</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Акции, скидки, открытие новых отделов.</p>
          </EntityCard>
          <EntityCard className="rounded-2xl p-5">
            <h3 className="font-black">Медицина и услуги</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Клиники, стоматологии, салоны, сервисы.</p>
          </EntityCard>
          <EntityCard className="rounded-2xl p-5">
            <h3 className="font-black">Банки и финансы</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Карты, кредиты, вклады, офисы продаж.</p>
          </EntityCard>
          <EntityCard className="rounded-2xl p-5">
            <h3 className="font-black">Недвижимость</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">ЖК, ипотека, застройщики, агентства.</p>
          </EntityCard>
        </div>
      </div>
    </section>
  )
}
