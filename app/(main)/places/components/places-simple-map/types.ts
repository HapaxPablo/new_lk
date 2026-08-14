import type { ICity } from '@/types/cities'

export interface PlacesSimpleMapProps {
  places: ICity[]
  cityName: string
  selectedPlaceId?: string | null
  onPlaceSelect?: (placeId: string) => void
  initialView?: MapView
  minZoom?: number
  markerScale?: number
}

export interface MapPoint {
  place: ICity
  coordinates: [number, number]
  title: string
}

export interface MapTile {
  key: string
  href: string
  x: number
  y: number
}

export interface VectorTileCoordinates {
  x: number
  y: number
}

export type LabelKind = 'street' | 'place' | 'poi' | 'house'

export interface MapLabel {
  id: string
  text: string
  kind: LabelKind
  x: number
  y: number
}

export interface VectorTileLabelDefinition {
  id: string
  text: string
  kind: LabelKind
  localX: number
  localY: number
}

export interface MapView {
  center: [number, number]
  zoom: number
}

export interface DragState {
  clientX: number
  clientY: number
  view: MapView
}
