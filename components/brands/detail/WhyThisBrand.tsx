const items: [string, string, string][] = [
  [
    '🎯',
    'Целевая аудитория',
    'Посетители точек бренда уже интересуются его товарами и услугами.',
  ],
  [
    '📍',
    'Разные города',
    'Можно выбрать одну точку или собрать размещение по нескольким адресам.',
  ],
  [
    '🔊',
    'Прямой контакт',
    'Реклама звучит или показывается внутри точки в момент выбора товара.',
  ],
  [
    '💰',
    'Доступный старт',
    'Размещение можно протестировать с небольшим бюджетом и затем масштабировать.',
  ],
]

export function WhyThisBrand({ brandName }: { brandName: string }) {
  return (
    <section className="border-y bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="text-center">
          <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
            Преимущества
          </div>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Почему стоит выбрать размещение в точках «{brandName}»
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {items.map(([icon, title, text], index) => (
            <div
              key={title}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white ${
                  index === 0
                    ? 'bg-[#ef5350]'
                    : index === 1
                      ? 'bg-[#18335f]'
                      : index === 2
                        ? 'bg-slate-900'
                        : 'bg-violet-600'
                }`}
              >
                {icon}
              </div>
              <h3 className="font-black text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
