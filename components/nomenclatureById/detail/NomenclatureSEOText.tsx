// components/nomenclatureById/detail/NomenclatureSEOText.tsx
interface NomenclatureSEOTextProps {
  placeName: string
  address?: string
  contentType?: string
}

export function NomenclatureSEOText({
  placeName,
  address,
  contentType,
}: NomenclatureSEOTextProps) {
  console.log('NomenclatureSEOText props:', { placeName, address, contentType }) // Debugging line
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
              SEO-блок
            </div>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              {contentType || 'Реклама'} в {placeName}
            </h2>
          </div>

          <div className="text-base leading-8 text-slate-600">
            <p>
              Размещение рекламы в {placeName} — это способ обратиться к
              посетителям площадки в момент покупки, прогулки или выбора услуг.
              {address ? ` Площадка находится по адресу ${address}` : ''} и
              подходит для продвижения локального бизнеса, федеральных брендов,
              акций и сезонных предложений.
            </p>

            <p className="mt-4">
              Рекламный материал транслируется на регулярной основе, что
              повышает частоту контакта с аудиторией. На странице можно
              посмотреть характеристики площадки, стоимость размещения,
              арендаторов и отправить заявку на запуск рекламной кампании.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
