'use client'

import PlacesMap from '../PlacesMap'
import type { PlacesSimpleMapProps } from './types'

export default function PlacesSimpleMap(props: PlacesSimpleMapProps) {
  const { places, cityName, selectedPlaceId, onPlaceSelect } = props

  return (
    <PlacesMap
      places={places}
      cityName={cityName}
      selectedPlaceId={selectedPlaceId}
      onPlaceSelect={onPlaceSelect}
    />
  )
}
