interface BrandFAQProps {
  brandName: string
  minPrice?: number
}

export function BrandFAQ({ brandName, minPrice }: BrandFAQProps) {
  const priceText = minPrice
    ? `от ${Math.round(minPrice)} ₽/день`
    : 'уточняется у менеджера'

  const items: [string, string][] = [
    [
      `Где можно разместить рекламу бренда «${brandName}»?`,
      'Реклама доступна в точках бренда, представленных в каталоге. Можно выбрать адрес и подходящий формат размещения.',
    ],
    [
      'Какой формат рекламы доступен?',
      'Основной формат — аудио- и видеореклама внутри точки. При необходимости можно подобрать дополнительные площадки.',
    ],
    [
      'Сколько стоит размещение?',
      `Ориентировочная стоимость ${priceText}. Итоговая цена зависит от адреса и срока размещения.`,
    ],
    [
      'Можно ли выбрать несколько адресов сразу?',
      `Да, можно выбрать несколько точек бренда «${brandName}» и собрать медиаплан по разным адресам.`,
    ],
  ]

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="max-w-3xl">
          <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
            FAQ
          </div>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Частые вопросы о рекламе в точках «{brandName}»
          </h2>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {items.map(([question, answer], index) => (
            <details
              key={question}
              open={index === 0}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
            >
              <summary className="cursor-pointer font-black text-slate-900">
                {question}
              </summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
