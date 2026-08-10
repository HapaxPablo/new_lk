import type { ICity } from '@/types/cities'

import {
  DEFAULT_CENTER,
  MAP_HEIGHT,
  MAP_WIDTH,
  MAX_ZOOM,
  MIN_ZOOM,
  TILE_SIZE,
  TILE_URL_TEMPLATE,
  VECTOR_TILES_MAX_ZOOM,
} from './constants'
import type { MapPoint, MapTile, MapView, VectorTileCoordinates } from './types'

export function getCoordinates(place: ICity): [number, number] | null {
  const { latitude, longitude } = place.formattedAddress.coordinates
  if (latitude == null || longitude == null) return null

  const lat = Number.parseFloat(latitude)
  const lng = Number.parseFloat(longitude)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (lat < 41 || lat > 82 || lng < 19 || lng > 169) return null

  return [lng, lat]
}

export function getMapView(points: MapPoint[]): MapView {
  if (points.length === 0) {
    return { center: DEFAULT_CENTER, zoom: 14 }
  }

  if (points.length === 1) {
    return { center: points[0].coordinates, zoom: 16 }
  }

  const longitudes = points.map(({ coordinates }) => coordinates[0])
  const latitudes = points.map(({ coordinates }) => coordinates[1])
  const minLng = Math.min(...longitudes)
  const maxLng = Math.max(...longitudes)
  const minLat = Math.min(...latitudes)
  const maxLat = Math.max(...latitudes)
  const span = Math.max(maxLng - minLng, (maxLat - minLat) * 1.7, 0.02)
  const zoom = Math.log2((MAP_WIDTH * 360) / (TILE_SIZE * span * 1.5))

  return {
    center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2],
    zoom: Math.max(MIN_ZOOM, Math.min(16, Math.floor(zoom))),
  }
}

export function toWorldCoordinates(
  [longitude, latitude]: [number, number],
  zoom: number
) {
  const worldSize = TILE_SIZE * 2 ** zoom
  const latitudeRadians = (latitude * Math.PI) / 180

  return {
    x: ((longitude + 180) / 360) * worldSize,
    y: ((1 - Math.asinh(Math.tan(latitudeRadians)) / Math.PI) / 2) * worldSize,
  }
}

export function fromWorldCoordinates(
  { x, y }: { x: number; y: number },
  zoom: number
): [number, number] {
  const worldSize = TILE_SIZE * 2 ** zoom
  const longitude = (x / worldSize) * 360 - 180
  const mercatorY = Math.PI - (2 * Math.PI * y) / worldSize
  const latitude = (180 / Math.PI) * Math.atan(Math.sinh(mercatorY))

  return [
    Math.max(-180, Math.min(180, longitude)),
    Math.max(-85.0511, Math.min(85.0511, latitude)),
  ]
}

export function getTiles(center: [number, number], zoom: number): MapTile[] {
  const worldCenter = toWorldCoordinates(center, zoom)
  const left = worldCenter.x - MAP_WIDTH / 2
  const top = worldCenter.y - MAP_HEIGHT / 2
  const tilesPerAxis = 2 ** zoom
  const minTileX = Math.floor(left / TILE_SIZE)
  const maxTileX = Math.floor((left + MAP_WIDTH) / TILE_SIZE)
  const minTileY = Math.max(0, Math.floor(top / TILE_SIZE))
  const maxTileY = Math.min(
    tilesPerAxis - 1,
    Math.floor((top + MAP_HEIGHT) / TILE_SIZE)
  )
  const tiles: MapTile[] = []

  for (let y = minTileY; y <= maxTileY; y += 1) {
    for (let x = minTileX; x <= maxTileX; x += 1) {
      const normalizedX = ((x % tilesPerAxis) + tilesPerAxis) % tilesPerAxis
      tiles.push({
        key: `${zoom}/${normalizedX}/${y}`,
        href: TILE_URL_TEMPLATE.replace('{z}', String(zoom))
          .replace('{x}', String(normalizedX))
          .replace('{y}', String(y)),
        x: x * TILE_SIZE - left,
        y: y * TILE_SIZE - top,
      })
    }
  }

  return tiles
}

export function getProjectionScale(zoom: number) {
  return (TILE_SIZE * 2 ** zoom) / (2 * Math.PI)
}

export function getVectorTileCoordinates(view: MapView): {
  zoom: number
  tiles: VectorTileCoordinates[]
} {
  const zoom = Math.min(view.zoom, VECTOR_TILES_MAX_ZOOM)
  const scale = 2 ** (zoom - view.zoom)
  const center = toWorldCoordinates(view.center, zoom)
  const left = center.x - (MAP_WIDTH / 2) * scale
  const top = center.y - (MAP_HEIGHT / 2) * scale
  const tilesPerAxis = 2 ** zoom
  const minTileX = Math.floor(left / TILE_SIZE)
  const maxTileX = Math.floor((left + MAP_WIDTH * scale) / TILE_SIZE)
  const minTileY = Math.max(0, Math.floor(top / TILE_SIZE))
  const maxTileY = Math.min(
    tilesPerAxis - 1,
    Math.floor((top + MAP_HEIGHT * scale) / TILE_SIZE)
  )
  const tiles: VectorTileCoordinates[] = []

  for (let y = minTileY; y <= maxTileY; y += 1) {
    for (let x = minTileX; x <= maxTileX; x += 1) {
      tiles.push({
        x: ((x % tilesPerAxis) + tilesPerAxis) % tilesPerAxis,
        y,
      })
    }
  }

  return { zoom, tiles }
}
