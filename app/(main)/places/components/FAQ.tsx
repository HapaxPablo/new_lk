interface FAQProps {
  cityName: string
}

export function FAQ({ cityName }: FAQProps) {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="max-w-3xl">
          <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">FAQ</div>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Частые вопросы о размещении рекламы
          </h2>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <details className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200" open>
            <summary className="cursor-pointer font-black text-slate-900">Где можно разместить рекламу?</summary>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Рекламу можно разместить в торговых центрах и других indoor-площадках города. Конкретный список зависит от доступных точек и выбранного формата.
            </p>
          </details>

          <details className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <summary className="cursor-pointer font-black text-slate-900">Какие форматы рекламы доступны?</summary>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Доступны аудиоролики, видеоролики на экранах, а также комплексные размещения на нескольких площадках.
            </p>
          </details>

          <details className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <summary className="cursor-pointer font-black text-slate-900">Сколько стоит размещение?</summary>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Стоимость зависит от площадки, длительности кампании, частоты выходов и формата. Цены варьируются в зависимости от выбранных параметров.
            </p>
          </details>

          <details className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <summary className="cursor-pointer font-black text-slate-900">Можно ли подобрать несколько ТЦ сразу?</summary>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Да, для увеличения охвата можно собрать пакет из нескольких торговых центров и запустить кампанию по всему городу.
            </p>
          </details>
        </div>
      </div>
    </section>
  )
}
