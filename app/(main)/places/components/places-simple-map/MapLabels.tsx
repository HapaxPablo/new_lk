import { memo } from 'react'

import type { MapLabel } from './types'
import { getLabelFontSize } from './vectorTileLabels'

interface MapLabelsProps {
  labels: MapLabel[]
  zoom: number
}

export const MapLabels = memo(function MapLabels({
  labels,
  zoom,
}: MapLabelsProps) {
  return (
    <g aria-hidden="true" pointerEvents="none">
      {labels.map((label) => (
        <text
          key={label.id}
          x={label.x}
          y={label.y}
          fill={
            label.kind === 'street'
              ? '#475569'
              : label.kind === 'house'
                ? '#64748b'
                : '#0f172a'
          }
          fontFamily="Montserrat, Arial, sans-serif"
          fontSize={getLabelFontSize(label.kind, zoom)}
          fontWeight={
            label.kind === 'place' ? 700 : label.kind === 'street' ? 600 : 500
          }
          paintOrder="stroke"
          stroke="#ffffff"
          strokeOpacity={0.95}
          strokeWidth={4}
          textAnchor="middle"
        >
          {label.text}
        </text>
      ))}
    </g>
  )
})
