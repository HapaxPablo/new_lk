import { CardMobile } from '@/components/ui/card/mobile/CardMobile'
import { INomenclatureItem } from '@/types/nomenclature'
import { Badge, MapPin, UserRound } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface NomenclatureCardProps {
  item: INomenclatureItem
  className?: string
}

export const NomenclatureItemMobile: React.FC<NomenclatureCardProps> = ({
  item,
  className = '',
}) => {
  return (
    <article className={`relative ${className}`}>
      <CardMobile>
        <span
          className="absolute right-2 top-2 text-gray-400 text-[0.5rem]"
          aria-label="Артикул товара"
        >
          {item.article}
        </span>

        <div className="flex flex-row gap-2 items-center">
          <figure
            className="grid h-full w-1/3"
            style={{ gridTemplateRows: '20% 5% 75%' }}
          >
            <Image
              src={item.logotype}
              alt={`Логотип бренда ${item.brand}`}
              width={100}
              height={100}
              className="w-full h-full object-cover"
              style={{ gridRow: '1 / 2' }}
              loading="lazy"
            />
            <div style={{ gridRow: '2 / 3' }} />
            {item.outside && (
              <Image
                src={item.outside}
                alt={`Фасад магазина ${item.name}`}
                width={100}
                height={100}
                className="w-full h-full object-cover"
                style={{ gridRow: '3 / 4' }}
                loading="lazy"
              />
            )}
          </figure>

          <section className="flex flex-col gap-1.5 w-full h-full">
            <header className="flex flex-row items-center gap-2 h-[20px]">
              <UserRound height={18} width={18} aria-hidden="true" />
              <h3 className="text-base font-semibold">
                {item.ownerPlaces ?? `${item.name.slice(0, 25)}...`}
              </h3>
            </header>

            <div className="flex flex-row items-center gap-2 h-[20px]">
              <Badge height={18} width={18} aria-hidden="true" />
              <span className="text-base font-semibold">{item.brand}</span>
            </div>

            <div className="flex flex-row items-center gap-2 h-[20px]">
              <MapPin height={18} width={18} aria-hidden="true" />
              <address className="not-italic text-base font-semibold">
                {item.address}
              </address>
            </div>
          </section>
        </div>
      </CardMobile>
    </article>
  )
}
