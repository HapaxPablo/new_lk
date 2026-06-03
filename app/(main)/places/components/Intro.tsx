interface IntroProps {
  cityName: string
}

export function Intro({ cityName }: IntroProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">Реклама в {cityName}</div>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Indoor-площадки для локального продвижения бизнеса
            </h2>
          </div>
          <p className="text-base leading-8 text-slate-600">
            Размещение рекламы в торговых центрах {cityName} подходит для федеральных и локальных брендов:
            магазинов, банков, медицинских центров, застройщиков, ресторанов, служб доставки и сервисных компаний.
            Формат помогает быстро охватить аудиторию, которая уже находится рядом с точками продаж.
          </p>
        </div>
      </div>
    </section>
  )
}
