// components/nomenclatureById/detail/SuitableBusinesses.tsx
const items: [string, string][] = [
  ['Магазины и ритейл', 'Акции, скидки, открытие отделов, новые коллекции.'],
  ['Медицина и услуги', 'Клиники, стоматологии, салоны, сервисные компании.'],
  ['Доставка и общепит', 'Рестораны, кафе, доставка еды, кофейни.'],
  ['Финансы и недвижимость', 'Банки, страхование, застройщики, агентства.'],
]

export function SuitableBusinesses() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="text-center">
          <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
            Кому подходит
          </div>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Для каких рекламодателей подходит эта площадка
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {items.map(([title, text]) => (
            <div
              key={title}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <h3 className="font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
