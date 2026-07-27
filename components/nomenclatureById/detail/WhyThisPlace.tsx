// components/nomenclatureById/detail/WhyThisPlace.tsx
interface WhyThisPlaceProps {
  placeName: string
}

const benefits: [string, string][] = [
  [
    'Локальная аудитория',
    'Точка подходит для продвижения бизнеса в конкретном районе города.',
  ],
  [
    'Регулярный трафик',
    'Посетители слышат или видят рекламное сообщение во время покупок и прогулки.',
  ],
  [
    'Частый контакт',
    'Формат обеспечивает повторяемость показа в течение всего периода размещения.',
  ],
  [
    'Низкий входной бюджет',
    'Формат можно протестировать с небольшим бюджетом и затем масштабировать.',
  ],
]

export function WhyThisPlace({ placeName }: WhyThisPlaceProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
              Преимущества площадки
            </div>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Почему стоит разместить рекламу в {placeName}
            </h2>
            <p className="mt-4 leading-8 text-slate-600">
              Страница места объясняет не только цену, но и ценность площадки:
              кто здесь бывает, какой формат контакта получает рекламодатель и
              для каких задач подходит размещение.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map(([title, text]) => (
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
