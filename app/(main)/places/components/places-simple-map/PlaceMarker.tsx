import { memo } from 'react'
import { Marker } from 'react-simple-maps'

import type { MapPoint } from './types'

interface PlaceMarkerProps {
  point: MapPoint
  isSelected: boolean
  isHighlighted: boolean
  onSelect: (placeId: string) => void
  onHoverChange: (placeId: string | null) => void
}

function splitMarkerTitle(title: string): string[] {
  const words = title.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 2) return [title]

  const middle = Math.ceil(words.length / 2)
  return [words.slice(0, middle).join(' '), words.slice(middle).join(' ')]
}

export const PlaceMarker = memo(function PlaceMarker({
  point,
  isSelected,
  isHighlighted,
  onSelect,
  onHoverChange,
}: PlaceMarkerProps) {
  const { place, coordinates, title } = point
  const lines = splitMarkerTitle(title)

  return (
    <Marker coordinates={coordinates}>
      <g
        aria-label={title}
        aria-pressed={isSelected}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.stopPropagation()
          onSelect(place.id)
        }}
        onPointerDown={(event) => event.stopPropagation()}
        onPointerEnter={() => onHoverChange(place.id)}
        onPointerLeave={() => onHoverChange(null)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelect(place.id)
          }
        }}
      >
        <circle r={isHighlighted ? 42 : 36} fill="#ef4444" fillOpacity={0.18} />
        <circle
          r={isHighlighted ? 34 : 30}
          fill={isSelected ? '#dc2626' : '#ef4444'}
          fillOpacity={0.92}
          stroke="#ffffff"
          strokeWidth={2.5}
          filter="url(#api1-marker-shadow)"
        />
        <text
          fill="#0f172a"
          fontFamily="Montserrat, Arial, sans-serif"
          fontSize={isHighlighted ? 11 : 10}
          fontWeight={700}
          paintOrder="stroke"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={5}
          textAnchor="middle"
          y={-48}
        >
          {lines.map((line, index) => (
            <tspan
              key={`${place.id}-label-${index}`}
              x={0}
              dy={index === 0 ? 0 : '2em'}
            >
              {line}
            </tspan>
          ))}
        </text>
        <text
          fill="#ffffff"
          fontFamily="Montserrat, Arial, sans-serif"
          fontSize={isHighlighted ? 8 : 7}
          fontWeight={700}
          textAnchor="middle"
        >
          {lines.map((line, index) => (
            <tspan
              key={`${place.id}-${index}`}
              x={0}
              dy={index === 0 ? `${-(lines.length - 1) * 1.1}em` : '1.4em'}
            >
              {line}
            </tspan>
          ))}
        </text>
      </g>
    </Marker>
  )
})
