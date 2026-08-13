import ModalFeedBack from '@/components/nomenclatureById/modalFeedBack/ModalFeedBack'
import { EntityCard } from '@/components/ui/card/EntityCard'

export function CTABrands() {
  return (
    <section id="brief" className="bg-[#ef5350]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <h2 className="text-3xl font-black text-white">
            Не знаете, какой бренд площадки выбрать?
          </h2>
          <p className="mt-3 max-w-3xl text-white/85">
            Оставьте заявку — подберём бренды и конкретные места размещения под
            бюджет, аудиторию и задачу рекламной кампании.
          </p>
        </div>

        <EntityCard className="flex items-center justify-center p-4 shadow-xl">
          <ModalFeedBack pathName="brands" />
        </EntityCard>
      </div>
      {/*
        TODO: в макете форма заявки содержит select "Интересующий город".
        Компонент Feedback (components/ui/forms/feedback/Feedback.tsx) такого поля
        не поддерживает — нужно расширить схему/пейлоад, если потребуется.
      */}
    </section>
  )
}
