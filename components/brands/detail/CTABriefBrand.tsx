import ModalFeedBack from '@/components/nomenclatureById/modalFeedBack/ModalFeedBack'

interface CTABriefBrandProps {
  brandName: string
  brandId: string
}

export function CTABriefBrand({ brandName, brandId }: CTABriefBrandProps) {
  return (
    <section id="brief" className="bg-[#ef5350]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-3xl font-black text-white">
            Хотите разместить рекламу в точках «{brandName}»?
          </h2>
          <p className="mt-3 max-w-3xl text-white/85">
            Оставьте заявку — подберём подходящие адреса, рассчитаем стоимость и
            предложим медиаплан под вашу задачу.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-xl">
          <ModalFeedBack pathName="brands" brandId={brandId} />
        </div>
      </div>
    </section>
  )
}
