export function Formats() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="max-w-3xl">
          <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">Форматы размещения</div>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Какие виды indoor-рекламы доступны
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ef5350] text-xl text-white">▶</div>
            <h3 className="text-xl font-black">Аудиореклама в ТЦ</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Рекламные аудиоролики транслируются внутри торговых центров и помогают донести предложение до посетителей.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#18335f] text-xl text-white">▣</div>
            <h3 className="text-xl font-black">Видеореклама на экранах</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Видеоформат подходит для акций, презентации бренда, открытия новой точки или продвижения сезонного предложения.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white">★</div>
            <h3 className="text-xl font-black">Комплексное размещение</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Можно объединить несколько ТЦ, форматов и сроков размещения, чтобы усилить охват по городу.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
