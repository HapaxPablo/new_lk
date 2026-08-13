import { IGroupedTenant } from '@/types/tenants'
import Image from 'next/image'
import Link from 'next/link'
import { EntityCard } from './EntityCard'

interface CardTenantProps {
  className?: string
  item: IGroupedTenant
}

export const CardTenant: React.FC<CardTenantProps> = ({
  item,
  className = '',
}) => (
  <EntityCard
    className={className}
    footer={
      <>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Площадок
          </div>
          <div className="mt-1 font-black text-[#18335f]!">{item.count}</div>
        </div>
        <Link
          href={`/tenants/${item.tenantId}`}
          className="rounded-xl bg-[#ef5350] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#d83c39] hover:text-white"
        >
          Подробнее
        </Link>
      </>
    }
    footerClassName="flex items-center justify-between gap-3"
  >
    <Link
      href={`/tenants/${item.tenantId}`}
      className="group relative flex h-44 items-center justify-center overflow-hidden bg-white p-5"
      aria-label={`Подробнее об арендаторе ${item.brandName || 'без названия'}`}
    >
      {item.brandLogotype ? (
        <Image
          src={item.brandLogotype}
          alt={`Логотип ${item.brandName || 'арендатора'}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 320px"
          className="object-contain p-5 transition duration-300 group-hover:scale-105"
        />
      ) : (
        <span className="text-center text-xl font-black text-slate-400">
          {item.brandName || 'Арендатор'}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/30 to-transparent" />
      <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-[#18335f]! shadow-sm">
        {item.count} площадок
      </span>
    </Link>
    <div className="p-5">
      <h3 className="truncate text-lg font-black text-slate-900">
        {item.brandName || 'Арендатор'}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Присутствует в местах размещения indoor-рекламы.
      </p>
    </div>
  </EntityCard>
)
