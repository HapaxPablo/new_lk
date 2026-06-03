interface CTAProps {
  cityName: string
}

export function CTA({ cityName }: CTAProps) {
  return (
    <section id="brief" className="bg-[#ef5350]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-3xl font-black text-white">
            Подберём площадки для рекламы в {cityName}
          </h2>
          <p className="mt-3 max-w-3xl text-white/85">
            Расскажите о задаче, бюджете и сроках — подготовим список подходящих ТЦ и рассчитаем стоимость размещения.
          </p>
        </div>
        <button className="rounded-xl bg-white px-7 py-4 text-sm font-black text-[#ef5350] shadow-lg hover:bg-slate-100">
          Получить медиаплан
        </button>
      </div>
    </section>
  )
}
