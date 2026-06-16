interface SEOTextProps {
  cityName: string
  cityNameSec: string
}

export function SEOText({ cityName, cityNameSec }: SEOTextProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">О размещении</div>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Реклама в торговых центрах {cityName}
            </h2>
          </div>

          <div className="space-y-4 text-slate-600 leading-8">
            <p>
              Indoor-реклама в {cityName} — это формат продвижения внутри торговых центров, супермаркетов
              и других коммерческих объектов с постоянным потоком посетителей. Размещение аудиорекламы
              и видеорекламы в ТЦ позволяет обратиться к аудитории в момент покупки, отдыха или выбора услуг.
            </p>

            <p>
              На странице собраны рекламные площадки {cityNameSec} с адресами, форматами размещения и ориентировочной
              стоимостью. Такой формат удобен для компаний, которым важно быстро выбрать точки контакта с аудиторией,
              сравнить условия и запустить рекламную кампанию без долгого поиска подрядчиков.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
