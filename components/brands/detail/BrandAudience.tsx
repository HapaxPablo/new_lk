const items: [string, string][] = [
  [
    'Ритейл и магазины',
    'Акции, скидки, открытие новых отделов, локальные распродажи.',
  ],
  ['Услуги и сервисы', 'Ремонт, доставка, бытовые услуги, сервисные компании.'],
  [
    'Финансы и недвижимость',
    'Банки, страхование, застройщики, ипотечные программы.',
  ],
  [
    'Локальный бизнес',
    'Кафе, салоны, клиники — всё, что рядом с точкой продаж.',
  ],
]

export function BrandAudience({ brandName }: { brandName: string }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
              Кому подходит
            </div>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Какие компании могут рекламироваться в точках «{brandName}»
            </h2>
            <p className="mt-4 leading-8 text-slate-600">
              Понять, подходит ли аудитория площадки под задачу, помогает
              описание бренда и типы бизнеса, которые уже размещаются на его
              точках.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {items.map(([title, text]) => (
              <div
                key={title}
                className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200"
              >
                <h3 className="font-black text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
