import Image from 'next/image'
import { IBrandDetail } from '@/types/brands'

interface HeroProps {
  brand: IBrandDetail
  placesCount: number
}

export function Hero({ brand, placesCount }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#18335f] to-[#2563eb]">
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="h-full w-full bg-[radial-gradient(circle_at_15%_20%,white,transparent_28%),radial-gradient(circle_at_85%_30%,white,transparent_25%),radial-gradient(circle_at_50%_95%,white,transparent_25%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <div className="flex h-48 items-center justify-center rounded-3xl bg-slate-50 ring-1 ring-slate-200">
            {brand.logotype ? (
              <div className="relative h-full w-full">
                <Image
                  src={brand.logotype}
                  alt={`Логотип ${brand.name}`}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>
            ) : (
              <div className="text-center">
                <div className="text-5xl font-black tracking-wide text-[#18335f]">
                  {brand.name?.toUpperCase()}
                </div>
                <div className="mx-auto mt-3 h-2 w-40 rounded-full bg-sky-400" />
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-center ring-1 ring-slate-200">
              <div className="text-2xl font-black text-[#ef5350]">
                {placesCount}
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-500">
                мест размещения
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-center ring-1 ring-slate-200">
              <div className="text-2xl font-black text-[#ef5350]">Indoor</div>
              <div className="mt-1 text-xs font-semibold text-slate-500">
                формат рекламы
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-center ring-1 ring-slate-200">
              <div className="text-2xl font-black text-[#ef5350]">
                {brand.min_price
                  ? `от ${Math.round(Number(brand.min_price))} ₽`
                  : '—'}
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-500">
                в день
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20">
            Бренд рекламных площадок
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-tight text-white md:text-5xl">
            Indoor-реклама в местах бренда «{brand.name}»
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">
            {brand.description
              ? brand.description
              : `Размещение аудио- и видеорекламы в торговых точках бренда «${brand.name}»: адреса, стоимость и форматы для локального продвижения бизнеса.`}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#places"
              className="rounded-xl bg-white px-6 py-3 text-sm font-black text-[#18335f] shadow-lg hover:bg-slate-100"
            >
              Смотреть места размещения
            </a>

            <a
              href="#brief"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-black text-white hover:bg-white/10"
            >
              Получить медиаплан
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
