'use client'

import { HelpTooltip } from '@/components/ui/tooltip/HelpTooltip'
import { IBrand } from '@/types/nomenclature'

interface BrandInfoProps {
  brand: IBrand
}

/**
 * Компонент для отображения информации о бренде с подсказкой.
 * Использует хук useTooltip через HelpTooltip.
 */
export function BrandInfo({ brand }: BrandInfoProps) {
  if (!brand?.id) {
    return <span>нет данных</span>
  }

  return (
    <span className="flex items-center gap-2">
      {brand.name || 'нет данных'}
      <HelpTooltip
        itemId={brand.id}
        endpoint={`/api/brands/${brand.id}`}
        title="Информация о бренде"
      />
    </span>
  )
}
