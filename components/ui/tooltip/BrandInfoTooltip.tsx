'use client'

import { HelpTooltip } from '@/components/ui/tooltip/HelpTooltip'
import { IBrand } from '@/types/nomenclature'

interface BrandInfoTooltipProps {
  brand: IBrand
}

/**
 * Компонент для отображения информации о бренде с подсказкой.
 * При клике на иконку делает запрос к /api/brands/{id}
 */
export function BrandInfoTooltip({ brand }: BrandInfoTooltipProps) {
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
