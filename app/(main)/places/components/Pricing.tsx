interface PricingProps {
  cityName: string
}

export function Pricing({ cityName }: PricingProps) {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">Стоимость</div>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Сколько стоит реклама в ТЦ {cityName}
            </h2>
            <p className="mt-4 leading-8 text-slate-600">
              Цена зависит от площадки, формата, длительности размещения и частоты выхода ролика.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm font-bold text-slate-500">Старт</div>
              <div className="mt-3 text-3xl font-black text-slate-900">от 97 ₽</div>
              <div className="mt-1 text-sm text-slate-500">за день</div>
              <p className="mt-4 text-sm leading-6 text-slate-600">Для тестового размещения на одной площадке.</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-2 ring-[#ef5350]">
              <div className="text-sm font-bold text-[#ef5350]">Оптимально</div>
              <div className="mt-3 text-3xl font-black text-slate-900">7–14 дней</div>
              <div className="mt-1 text-sm text-slate-500">кампания</div>
              <p className="mt-4 text-sm leading-6 text-slate-600">Для акции, открытия или локального продвижения.</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm font-bold text-slate-500">Пакет</div>
              <div className="mt-3 text-3xl font-black text-slate-900">3+ ТЦ</div>
              <div className="mt-1 text-sm text-slate-500">охват</div>
              <p className="mt-4 text-sm leading-6 text-slate-600">Для максимального покрытия аудитории города.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
