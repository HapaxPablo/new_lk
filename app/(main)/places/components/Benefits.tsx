export function Benefits() {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-[#ffb0ae]">Преимущества</div>
            <h2 className="mt-2 text-3xl font-black">
              Почему реклама в торговых центрах работает
            </h2>
            <p className="mt-4 leading-8 text-white/70">
              Посетители ТЦ уже находятся в потребительском сценарии: выбирают товары, услуги, места отдыха
              и готовы реагировать на понятные локальные предложения.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
              <h3 className="font-black">Локальный охват</h3>
              <p className="mt-2 text-sm leading-7 text-white/70">
                Реклама показывается аудитории конкретного города и района.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
              <h3 className="font-black">Повторные контакты</h3>
              <p className="mt-2 text-sm leading-7 text-white/70">
                Посетители слышат или видят рекламу несколько раз за время визита.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
              <h3 className="font-black">Быстрый запуск</h3>
              <p className="mt-2 text-sm leading-7 text-white/70">
                Подходит для акций, распродаж, открытий и сезонных кампаний.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
              <h3 className="font-black">Гибкий бюджет</h3>
              <p className="mt-2 text-sm leading-7 text-white/70">
                Можно выбрать одну площадку или собрать пакет по нескольким ТЦ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
