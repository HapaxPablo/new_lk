const items: [string, string][] = [
  [
    'Что такое бренд места?',
    'Это торговый центр, торговая сеть или площадка, внутри которой доступны места для размещения indoor-рекламы.',
  ],
  [
    'Зачем выбирать рекламу по бренду?',
    'Поиск по бренду удобен, если рекламодатель хочет разместиться в конкретном торговом центре или сети с известной аудиторией.',
  ],
  [
    'Что отображается на странице бренда?',
    'На странице бренда можно посмотреть список доступных рекламных точек, адреса, форматы размещения и стоимость.',
  ],
  [
    'Можно ли подобрать несколько брендов сразу?',
    'Да, можно собрать медиаплан из нескольких брендов и площадок, чтобы увеличить охват рекламной кампании.',
  ],
]

export function FAQBrands() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="max-w-3xl">
          <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
            FAQ
          </div>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Частые вопросы о брендах рекламных площадок
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
