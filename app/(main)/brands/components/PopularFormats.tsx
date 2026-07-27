export function PopularFormats() {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="max-w-3xl">
          <div className="text-sm font-bold uppercase tracking-wider text-[#ffb0ae]">
            Форматы размещения
          </div>
          <h2 className="mt-2 text-3xl font-black">
            Какие форматы рекламы доступны у брендов площадок
          </h2>
          <p className="mt-4 leading-8 text-white/70">
            Этот блок связывает раздел брендов с коммерческими запросами по
            аудио-, видео- и indoor-рекламе.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ef5350] text-xl text-white">
              ▶
            </div>
            <h3 className="text-xl font-black">Аудиореклама в ТЦ</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Трансляция роликов через громкоговорители торговых центров и
              сетевых площадок.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6d5df6] text-xl text-white">
              ▣
            </div>
            <h3 className="text-xl font-black">Видеореклама</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Размещение видеороликов на indoor-экранах внутри торговых центров
              и общественных пространств.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl text-[#18335f]">
              ★
            </div>
            <h3 className="text-xl font-black">Пакетное размещение</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Подбор нескольких площадок одного бренда или разных брендов для
              увеличения охвата.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
