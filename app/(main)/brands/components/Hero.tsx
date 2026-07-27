import { SearchForm } from '@/components/search-form/SearchForm'

interface HeroProps {
  totalBrands: number
  minPrice?: number
}

export function Hero({ totalBrands, minPrice }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#18335f] to-[#ef5350]">
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,white,transparent_30%),radial-gradient(circle_at_80%_30%,white,transparent_25%),radial-gradient(circle_at_50%_90%,white,transparent_25%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20">
            Каталог брендов рекламных площадок
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-tight text-white md:text-5xl">
            Бренды торговых центров и мест для размещения рекламы
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">
            Выберите бренд торгового центра, сети или рекламной площадки, чтобы
            посмотреть доступные места для размещения аудио- и видеорекламы:
            адреса, стоимость и условия запуска.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#brands"
              className="rounded-xl bg-white px-6 py-3 text-sm font-black text-[#18335f] shadow-lg hover:bg-slate-100"
            >
              Смотреть бренды
            </a>

            <a
              href="#brief"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-black text-white hover:bg-white/10"
            >
              Получить подборку
            </a>
          </div>

          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
              <div className="text-2xl font-black text-white">
                {totalBrands}+
              </div>
              <div className="mt-1 text-xs text-white/75">
                брендов в каталоге
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
              <div className="text-2xl font-black text-white">
                {minPrice ? `от ${Math.round(minPrice)} ₽` : '—'}
              </div>
              <div className="mt-1 text-xs text-white/75">за день рекламы</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
              <div className="text-2xl font-black text-white">Indoor</div>
              <div className="mt-1 text-xs text-white/75">
                формат размещения
              </div>
            </div>
          </div>
          {/*
            TODO: в макете есть блок "551+ точка размещения" (суммарное кол-во мест
            по всем брендам). API /api/brands/assigned такого поля не возвращает
            (только min_price и count брендов) — нужен отдельный агрегат с бэка.
          */}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-2xl">
          <div>
            <div className="text-xl font-black text-slate-900">
              Найти бренд площадки
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Введите название бренда — система покажет подходящие варианты
              размещения.
            </p>
          </div>

          <div className="mt-5">
            <SearchForm
              placeholder="Например: Мега, Командор, Сибирский городок"
              buttonText="Найти"
              className="flex-col gap-3"
            />
          </div>

          {/*
            TODO: в макете здесь есть селекты "Город" и "Тип площадки".
            Сейчас /api/brands/assigned поддерживает только search, limit, offset —
            нужно добавить city / type_of_place на бэке и в route.ts, чтобы вернуть эти фильтры.
          */}
        </div>
      </div>
    </section>
  )
}
