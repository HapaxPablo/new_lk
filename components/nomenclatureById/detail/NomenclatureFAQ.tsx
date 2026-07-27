// components/nomenclatureById/detail/NomenclatureFAQ.tsx
import { formatPrice } from '@/utils/nomenclatureUtils'

interface NomenclatureFAQProps {
  placeName: string
  pricePerDay?: string
  contentType?: string
}

export function NomenclatureFAQ({
  placeName,
  pricePerDay,
  contentType,
}: NomenclatureFAQProps) {
  const priceText = pricePerDay
    ? `от ${formatPrice(pricePerDay)}/день`
    : 'уточняется у менеджера'

  const items: [string, string][] = [
    [
      `Сколько стоит размещение рекламы в ${placeName}?`,
      `Стоимость зависит от периода размещения и составляет ${priceText}. Точный расчёт по выбранному сроку подготовит менеджер.`,
    ],
    [
      'Какой формат рекламы доступен?',
      contentType
        ? `Для данной площадки доступен формат: ${contentType}.`
        : 'Формат размещения уточняется у менеджера в зависимости от возможностей площадки.',
    ],
    [
      'Сколько раз будет выходить ролик?',
      'Частота выходов зависит от выбранного тарифа и согласовывается при оформлении заявки.',
    ],
    [
      'Можно ли подобрать похожие площадки?',
      'Да, можно подобрать дополнительные площадки и собрать медиаплан по нескольким точкам.',
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
            Частые вопросы о размещении рекламы на этой площадке
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
