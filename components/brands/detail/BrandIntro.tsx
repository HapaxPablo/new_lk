interface BrandIntroProps {
  brandName: string
  description?: string
}

export function BrandIntro({ brandName, description }: BrandIntroProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
              О бренде
            </div>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Рекламные места бренда «{brandName}» для продвижения товаров и
              услуг
            </h2>
          </div>

          <div className="space-y-4 text-base leading-8 text-slate-600">
            <p>
              {description ||
                `«${brandName}» — сеть точек и торговых площадок, где можно разместить indoor-рекламу для локальной аудитории.`}
            </p>
            <p>
              На странице собраны доступные места размещения бренда: адреса,
              стоимость, формат рекламы и кнопка для быстрой отправки заявки на
              запуск ролика.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
