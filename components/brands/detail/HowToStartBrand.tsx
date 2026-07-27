const steps: [string, string, string][] = [
  [
    '01',
    'Выберите точки',
    'Определите подходящие адреса бренда для размещения.',
  ],
  [
    '02',
    'Согласуйте тариф',
    'Менеджер уточнит доступность и предложит период размещения.',
  ],
  [
    '03',
    'Подготовьте ролик',
    'Передайте готовый ролик или запросите помощь с подготовкой.',
  ],
  ['04', 'Запустите рекламу', 'Кампания выходит по согласованному графику.'],
]

export function HowToStartBrand({ brandName }: { brandName: string }) {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="max-w-3xl">
          <div className="text-sm font-bold uppercase tracking-wider text-[#ffb0ae]">
            Как запустить
          </div>
          <h2 className="mt-2 text-3xl font-black">
            Как разместить рекламу в точках бренда «{brandName}»
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {steps.map(([number, title, text]) => (
            <div
              key={number}
              className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10"
            >
              <div className="text-4xl font-black text-[#ffb0ae]">{number}</div>
              <h3 className="mt-4 font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
