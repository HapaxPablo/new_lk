'use client'

import { useState } from 'react'
import { getStatusConfig, TStatusType } from '@/types/nomenclature/status'

interface DeviceStatusBadgeProps {
  status: TStatusType
  answer: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function DeviceStatusBadge({
  status,
  answer,
  className = '',
  size = 'md',
}: DeviceStatusBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const config = getStatusConfig(status)

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  const containerClasses = `
    inline-flex items-center justify-center gap-2
    ${config.bgColor} ${config.color}
    ${sizeClasses[size]} font-medium rounded
    transition-colors duration-200 cursor-default
    ${className}
  `
  const tooltipClasses = `absolute bottom-full left-1/2 
          transform -translate-x-1/2 
          mb-2 px-3 py-2
          ${config.bgColor}
          rounded shadow-lg z-50
          whitespace-nowrap
         `

  return (
    <div className="relative inline-flex">
      <div
        className={containerClasses}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        // title={config.description}
      >
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </div>

      {showTooltip && config.description && (
        <div className={tooltipClasses}>
          {config.description}-{answer === null ? 'нет данных' : answer}
        </div>
      )}
    </div>
  )
}
