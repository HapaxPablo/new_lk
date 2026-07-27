interface BrandSEOTextProps {
  brandName: string
}

export function BrandSEOText({ brandName }: BrandSEOTextProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
              SEO-блок
            </div>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Indoor-реклама в местах бренда «{brandName}»
            </h2>
          </div>

          <div className="text-base leading-8 text-slate-600">
            <p>
              Размещение indoor-рекламы в точках бренда «{brandName}» помогает
              обратиться к аудитории посетителей в момент покупки, выбора товара
              или ожидания. Аудио- и видеоролики транслируются внутри точек и
              повышают частоту контакта с потенциальными клиентами.
            </p>
            <p className="mt-4">
              На странице собраны доступные места размещения бренда «{brandName}
              » с адресами, стоимостью и форматом рекламы. Можно выбрать одну
              точку или собрать медиаплан из нескольких адресов для увеличения
              охвата.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
