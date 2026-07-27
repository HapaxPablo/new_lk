// Блок носит справочный характер: у API нет фильтрации брендов по категориям,
// поэтому карточки ниже не кликабельны и не связаны с queryparams.
const categories: [string, string, string, string][] = [
  [
    'ТЦ',
    'Торговые центры',
    'Бренды торговых центров и комплексов, где можно разместить аудио- и видеорекламу.',
    'bg-[#ef5350]',
  ],
  [
    'С',
    'Сетевые площадки',
    'Сети супермаркетов, магазинов и городских объектов с регулярным потоком посетителей.',
    'bg-[#18335f]',
  ],
  [
    '▶',
    'Аудиосети',
    'Площадки, где доступна трансляция аудиороликов через внутренние и наружные громкоговорители.',
    'bg-slate-900',
  ],
  [
    '▣',
    'Indoor-экраны',
    'Бренды и площадки, где можно запускать видеорекламу на экранах внутри помещений.',
    'bg-violet-600',
  ],
]

export function BrandCategories() {
  return (
    <section className="border-y bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
              Категории
            </div>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Какие бренды площадок представлены в каталоге
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {categories.map(([icon, title, text, color]) => (
            <div
              key={title}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white ${color}`}
              >
                {icon}
              </div>
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
