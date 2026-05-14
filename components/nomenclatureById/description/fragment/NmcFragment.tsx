import { FieldLabel } from '@/components/ui/fields/fieldLabel/FieldLabel'
import { FieldValue } from '@/components/ui/fields/fieldValue/FieldValue'
import React from 'react'

export function NmcFragment({
  text,
  type,
  onClick,
  className = '',
}: {
  text: string | number
  type: string
  onClick?: () => void
  className?: string
}) {
  return (
    <>
      {text && (
        <div className="w-full h-full flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2">
          <FieldLabel text={type} ariaLabel={`${type} ${text}`} />
          <FieldValue
            text={`${text}`.trim()}
            type="span"
            ariaLabel={`${type} ${text}`}
            onClick={onClick}
            className={className}
          />
        </div>
      )}
    </>
  )
}
