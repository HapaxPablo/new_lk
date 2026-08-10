import type { LabelKind } from './types'

export const TILE_SIZE = 512
export const MAP_WIDTH = 800
export const MAP_HEIGHT = 500
export const MIN_ZOOM = 3
export const MAX_ZOOM = 20
export const VECTOR_TILES_MAX_ZOOM = 14
export const LABEL_LOAD_DELAY = 150
export const MAX_CACHED_VECTOR_TILES = 128
export const TILE_URL_TEMPLATE = `${process.env.NEXT_PUBLIC_MAP_STYLE_URL || process.env.MAP_STYLE_URL}512/{z}/{x}/{y}.png`
export const DEFAULT_CENTER: [number, number] = [92.87, 56.01]

export const VECTOR_LABEL_LAYERS: Array<{
  id: string
  kind: LabelKind
  property: string
  limit: number
}> = [
  { id: 'transportation_name', kind: 'street', property: 'name', limit: 12 },
  { id: 'place', kind: 'place', property: 'name', limit: 4 },
  { id: 'poi', kind: 'poi', property: 'name', limit: 6 },
  { id: 'housenumber', kind: 'house', property: 'housenumber', limit: 12 },
]

export const LABEL_LIMITS: Record<LabelKind, number> = {
  place: 3,
  street: 7,
  poi: 3,
  house: 6,
}

export const LABEL_PRIORITY: Record<LabelKind, number> = {
  place: 4,
  street: 3,
  poi: 2,
  house: 1,
}
