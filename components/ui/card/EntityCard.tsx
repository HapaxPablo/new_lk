import type { ElementType, ReactNode } from 'react'

type EntityCardTone = 'default' | 'muted' | 'inverted'

interface EntityCardProps {
  children: ReactNode
  footer?: ReactNode
  className?: string
  footerClassName?: string
  as?: ElementType
  href?: string
  open?: boolean
  tone?: EntityCardTone
}

const toneClassNames: Record<EntityCardTone, string> = {
  default:
    'bg-white shadow-sm ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-md',
  muted: 'bg-slate-50 ring-1 ring-slate-200',
  inverted: 'bg-white/10 ring-1 ring-white/10',
}

/**
 * Единый каркас карточек сущностей в каталогах.
 * Содержимое и действия передаются слотами, поэтому карточка не привязана
 * к конкретному типу сущности.
 */
export const EntityCard = ({
  children,
  footer,
  className = '',
  footerClassName = '',
  as: Component = 'article',
  href,
  open,
  tone = 'default',
}: EntityCardProps) => (
  <Component
    className={`overflow-hidden rounded-3xl transition duration-200 ${toneClassNames[tone]} ${className}`}
    href={href}
    open={open}
  >
    {children}
    {footer && (
      <div className={`border-t border-slate-100 px-5 py-4 ${footerClassName}`}>
        {footer}
      </div>
    )}
  </Component>
)
