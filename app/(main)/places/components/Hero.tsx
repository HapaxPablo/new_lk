interface HeroProps {
  cityName: string
  placesCount: number
  minPrice: number
}

export function Hero({ cityName, placesCount, minPrice }: HeroProps) {
  // console.log('minPrice in Hero:', minPrice)
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#18335f] to-[#ef5350]">
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,white,transparent_30%),radial-gradient(circle_at_80%_30%,white,transparent_25%),radial-gradient(circle_at_40%_90%,white,transparent_25%)]"></div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20">
            Indoor-реклама в торговых центрах {cityName}
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-tight text-white md:text-5xl">
            Размещение аудиовизуальной рекламы в ТЦ {cityName}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">
            Подберите рекламные площадки в торговых центрах {cityName}: аудиоролики, видеоролики,
            indoor-экраны и объявления в местах с высоким ежедневным трафиком.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#places" className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#18335f] shadow-lg hover:bg-slate-100">
              Смотреть площадки
            </a>
            <a href="#brief" className="rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
              Получить подборку
            </a>
          </div>

          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
              <div className="text-2xl font-black text-white">{placesCount}+</div>
              <div className="mt-1 text-xs text-white/75">площадок в городе</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
              <div className="text-2xl font-black text-white">от {minPrice || ''} ₽</div>
              <div className="mt-1 text-xs text-white/75">стоимость в день</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
              <div className="text-2xl font-black text-white">ТЦ</div>
              <div className="mt-1 text-xs text-white/75">основной формат</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
              <div className="text-2xl font-black text-white">7 дней</div>
              <div className="mt-1 text-xs text-white/75">быстрый запуск</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-2xl">
          <div className="mb-5">
            <div className="text-xl font-black text-slate-900">Быстрый подбор площадок</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Оставьте параметры кампании — подберём торговые центры и рассчитаем размещение рекламы.
            </p>
          </div>

          <div className="space-y-3">
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#ef5350]" placeholder="Ваше имя" />
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#ef5350]" placeholder="Телефон" />
            <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500 outline-none focus:border-[#ef5350]">
              <option>Цель размещения</option>
              <option>Повысить узнаваемость бренда</option>
              <option>Привлечь клиентов в магазин</option>
              <option>Реклама акции или открытия</option>
            </select>
            <button className="w-full rounded-xl bg-[#ef5350] px-5 py-3 text-sm font-black text-white shadow-md hover:bg-[#e14442]">
              Получить предложение
            </button>
            <p className="text-center text-xs text-slate-400">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
