import { CardDesktop } from '@/components/ui/card/desktop/CardDesktop'
import { INomenclatureItem } from '@/types/nomenclature'
import Image from 'next/image'

interface NomenclatureCardProps {
  item: INomenclatureItem
  className?: string
}

export const NomenclatureItemDesktop: React.FC<NomenclatureCardProps> = ({
  item,
  className = '',
}) => {
  return (
    <article className={`${className}`}>
      <CardDesktop>
        <figure className="h-full flex flex-col items-center justify-center gap-1.5">
          {item.outside && (
            <div
              className="w-full"
              style={{ aspectRatio: '3/2', position: 'relative' }}
            >
              <Image
                src={item.outside}
                alt={`Фасад магазина ${item.name}`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 600px) 100vw, 600px"
                loading="lazy"
              />
            </div>
          )}
          <div
            className="w-2/5"
            style={{ aspectRatio: '2/1', position: 'relative' }}
          >
            <Image
              src={item.logotype}
              alt={`Логотип бренда ${item.brand}`}
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 240px) 100vw, 240px"
              loading="lazy"
            />
          </div>
        </figure>
        <section className="flex flex-col gap-1.5 w-full h-full">
          <header className="flex flex-row items-center gap-2 h-[20px]">
            <div className="flex flex-row items-center gap-2 h-[20px] text-nowrap">
              {/* <Badge height={18} width={18} aria-hidden="true" /> */}
              <label className=" text-gray-400">Бренд:</label>
              <h3 className="text-base font-semibold">{item.brand}</h3>
            </div>
          </header>

          <div className="flex flex-row items-center gap-2 h-[20px] text-nowrap">
            {/* <UserRound height={18} width={18} aria-hidden="true" /> */}
            <label className=" text-gray-400">Название:</label>
            <h3 className="text-base font-semibold">
              {item.ownerPlaces ?? `${item.name.slice(0, 25)}...`}
            </h3>
          </div>

          <div className="flex flex-row items-center gap-2 h-[20px] text-nowrap">
            {/* <MapPin height={18} width={18} aria-hidden="true" /> */}
            <label className=" text-gray-400">Адрес:</label>
            <address className="not-italic text-base font-semibold">
              {item.address}
            </address>
          </div>
          <div className="flex flex-row items-center gap-2 h-[20px] text-nowrap">
            {/* <MapPin height={18} width={18} aria-hidden="true" /> */}
            <label className="text-xs text-gray-400">Артикул:</label>
            <span
              className="not-italic text-xs text-gray-400"
              aria-label="Артикул товара"
            >
              {item.article}
            </span>
          </div>
        </section>
      </CardDesktop>
    </article>
  )
}
