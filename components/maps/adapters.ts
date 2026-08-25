import type { MapMarker } from './types'

type CoordinateValue = string | number | null | undefined

export interface StringCoordinates {
  latitude?: CoordinateValue
  longitude?: CoordinateValue
}

export interface MapMarkerInput {
  id: string
  title?: string | null
  name?: string | null
  address?: string | null
  coordinates?: StringCoordinates | null
  formattedAddress?: {
    name?: string | null
    coordinates?: StringCoordinates
  }
  typeOfPlace?: string | null
  type_of_place?: string | null
  imageUrl?: string | null
  logoUrl?: string | null
  href?: string | null
  nomenclatureSlug?: string | null
  old_slug?: string | null
  exterior?: Array<{ source?: string | null }> | null
  facade?: { source?: string | null } | null
  brand?: {
    name?: string | null
    logotype?: string | null
  } | null
}

export interface MapFeatureCollection {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    geometry: {
      type: 'Point'
      coordinates: [number, number]
    }
    properties: Omit<MapMarker, 'coordinates'>
  }>
}

export type MapBounds = [
  southwest: [number, number],
  northeast: [number, number],
]

export function parseCoordinate(value: CoordinateValue): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value !== 'string' || !value.trim()) return null

  const normalized = value.trim().replace(',', '.')
  const coordinate = Number(normalized)
  return Number.isFinite(coordinate) ? coordinate : null
}

export function isValidCoordinates(
  coordinates: [number, number]
): coordinates is [lng: number, lat: number] {
  const [lng, lat] = coordinates
  return (
    Number.isFinite(lng) &&
    Number.isFinite(lat) &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90
  )
}

export function parseCoordinates(
  coordinates?: StringCoordinates
): [lng: number, lat: number] | null {
  const latitude = parseCoordinate(coordinates?.latitude)
  const longitude = parseCoordinate(coordinates?.longitude)

  if (latitude === null || longitude === null) return null

  const result: [number, number] = [longitude, latitude]
  return isValidCoordinates(result) ? result : null
}

export function toMapMarker(input: MapMarkerInput): MapMarker | null {
  const coordinates = parseCoordinates(
    input.coordinates ?? input.formattedAddress?.coordinates
  )
  if (!coordinates || !input.id) return null

  const title = [
    input.title,
    input.typeOfPlace ?? input.type_of_place,
    input.brand?.name,
    input.name,
  ]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(' ')
    .trim()

  return {
    id: input.id,
    coordinates,
    title: title || 'Рекламная площадка',
    address: input.address ?? input.formattedAddress?.name ?? undefined,
    imageUrl:
      input.imageUrl ??
      input.exterior?.[0]?.source ??
      input.facade?.source ??
      undefined,
    logoUrl: input.logoUrl ?? input.brand?.logotype ?? undefined,
    href:
      input.href ??
      (input.nomenclatureSlug || input.old_slug
        ? `/nomenclatures/${input.nomenclatureSlug ?? input.old_slug}`
        : undefined),
  }
}

export function buildMapFeatureCollection(
  markers: MapMarker[]
): MapFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: markers
      .filter((marker) => isValidCoordinates(marker.coordinates))
      .map(({ coordinates, ...properties }) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates,
        },
        properties,
      })),
  }
}

export function getMapBounds(markers: MapMarker[]): MapBounds | null {
  const validMarkers = markers.filter((marker) =>
    isValidCoordinates(marker.coordinates)
  )
  if (!validMarkers.length) return null

  let [minLng, minLat] = validMarkers[0].coordinates
  let [maxLng, maxLat] = validMarkers[0].coordinates

  for (const marker of validMarkers.slice(1)) {
    const [lng, lat] = marker.coordinates
    minLng = Math.min(minLng, lng)
    minLat = Math.min(minLat, lat)
    maxLng = Math.max(maxLng, lng)
    maxLat = Math.max(maxLat, lat)
  }

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ]
}

export function isSafeMapUrl(value: string | undefined): boolean {
  if (!value) return false

  try {
    const url = new URL(value, 'https://map.local')
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}
