'use client'

import { CircleHelp } from 'lucide-react'
import { useTooltip } from '@/providers/tooltip/TooltipProvider'
import styles from './HelpTooltip.module.scss'

interface HelpTooltipProps {
  /** ID элемента для запроса */
  itemId: string
  /** API эндпоинт (например, /api/brands/123) */
  endpoint: string
  /** Заголовок модального окна */
  title: string
  /** CSS класс для обертки */
  className?: string
}

/**
 * Компонент "Подсказка" - оборачивает любой компонент и отображает
 * иконку знака вопроса. При клике открывается модальное окно с информацией.
 */
export function HelpTooltip({
  itemId,
  endpoint,
  title,
  className = '',
}: HelpTooltipProps) {
  const { openTooltip } = useTooltip()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openTooltip({
      id: itemId,
      endpoint,
      title,
    })
  }

  return (
    <span className={`${styles.tooltipWrapper} ${className}`}>
      <button
        type="button"
        className={styles.tooltipButton}
        onClick={handleClick}
        aria-label={`Подробнее: ${title}`}
        title="Подробнее"
      >
        <CircleHelp size={16} className={styles.icon} />
      </button>
    </span>
  )
}
