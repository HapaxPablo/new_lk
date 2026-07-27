// components/nomenclatureById/detail/CTABriefSection.tsx
import ModalFeedBack from '@/components/nomenclatureById/modalFeedBack/ModalFeedBack'

interface CTABriefSectionProps {
  placeName: string
  nomenclaturesIds: string[]
}

export function CTABriefSection({
  placeName,
  nomenclaturesIds,
}: CTABriefSectionProps) {
  return (
    <section id="brief" className="bg-[#ef5350]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-3xl font-black text-white">
            Хотите разместить рекламу в {placeName}?
          </h2>
          <p className="mt-3 max-w-3xl text-white/85">
            Оставьте заявку — подготовим расчёт стоимости, проверим доступность
            размещения и предложим дополнительные площадки.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-xl">
          <ModalFeedBack
            pathName="nomenclatures"
            nomenclaturesIds={nomenclaturesIds}
          />
        </div>
      </div>
    </section>
  )
}
