import { INomenclatureItem } from '@/types/nomenclature'
import { Badge, MapPin, UserRound } from 'lucide-react'
import React from 'react'

interface NomenclatureCardProps {
  item: INomenclatureItem
  className?: string
  children?: React.ReactNode
}

export const NomenclatureCard: React.FC<NomenclatureCardProps> = ({
  item,
  className = '',
  children,
}) => {
  return (
    <div
      className={`relative  p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow ${className} bg-white`}
    >
      <div className="absolute right-2 top-2">
        <span className="text-gray-400 text-[0.5rem]">{item.articule}</span>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <div
          className="grid h-full w-1/3"
          style={{ gridTemplateRows: '20% 5% 75%' }}
        >
          <img
            src="/wall.jpg"
            alt="logo1"
            className="w-full h-full object-cover"
            style={{ gridRow: '1 / 2' }}
          />
          <div style={{ gridRow: '2 / 3' }} />
          <img
            src="/wall.jpg"
            alt="logo2"
            className="w-full h-full object-cover"
            style={{ gridRow: '3 / 4' }}
          />
        </div>
        <div className="flex flex-col gap-1.5 w-full h-full">
          <div className="flex flex-row items-center gap-2 h-[20px]">
            <UserRound height={18} width={18} />
            <h2 className="text-base font-semibold">{item.ownerPlaces}</h2>
          </div>
          <div className="flex flex-row items-center gap-2 h-[20px]">
            <Badge height={18} width={18} />
            <h2 className="text-base font-semibold">{item.phoneNumber}</h2>
          </div>
          <div className="flex flex-row items-center gap-2 h-[20px]">
            <MapPin height={18} width={18} />
            <h2 className="text-base font-semibold">{item.address}</h2>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
