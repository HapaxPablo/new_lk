import { VectorTile } from '@mapbox/vector-tile'
import { PbfReader } from 'pbf'

import {
  LABEL_LIMITS,
  LABEL_PRIORITY,
  MAP_HEIGHT,
  MAP_WIDTH,
  MAX_CACHED_VECTOR_TILES,
  TILE_SIZE,
  VECTOR_LABEL_LAYERS,
} from './constants'
import { toWorldCoordinates } from './mapMath'
import type {
  LabelKind,
  MapLabel,
  MapView,
  VectorTileCoordinates,
  VectorTileLabelDefinition,
} from './types'

const vectorTileLabelCache = new Map<
  string,
  Promise<VectorTileLabelDefinition[]>
>()

function getFeatureAnchor(feature: {
  loadGeometry: () => { x: number; y: number }[][]
}) {
  const geometry = feature.loadGeometry()
  const longestLine = geometry.reduce<{ x: number; y: number }[]>(
    (longest, line) => (line.length > longest.length ? line : longest),
    []
  )

  if (longestLine.length === 0) return null
  return longestLine[Math.floor(longestLine.length / 2)]
}

function getVectorTileLabelDefinitions(
  data: ArrayBuffer
): VectorTileLabelDefinition[] {
  const vectorTile = new VectorTile(new PbfReader(new Uint8Array(data)))
  const labels: VectorTileLabelDefinition[] = []

  VECTOR_LABEL_LAYERS.forEach(({ id, kind, property, limit }) => {
    const layer = vectorTile.layers[id]
    if (!layer) return

    let count = 0
    for (let index = 0; index < layer.length && count < limit; index += 1) {
      const feature = layer.feature(index)
      const value = feature.properties[property]
      if (typeof value !== 'string' && typeof value !== 'number') continue

      const anchor = getFeatureAnchor(feature)
      if (!anchor) continue

      labels.push({
        id: `${id}-${feature.id ?? index}`,
        text: String(value),
        kind,
        localX: (anchor.x / layer.extent) * TILE_SIZE,
        localY: (anchor.y / layer.extent) * TILE_SIZE,
      })
      count += 1
    }
  })

  return labels
}

export function projectVectorTileLabels(
  definitions: VectorTileLabelDefinition[],
  tile: VectorTileCoordinates,
  vectorZoom: number,
  view: MapView
): MapLabel[] {
  const mapWorldCenter = toWorldCoordinates(view.center, view.zoom)
  const vectorToMapScale = 2 ** (view.zoom - vectorZoom)

  return definitions.flatMap((definition) => {
    const worldX = (tile.x * TILE_SIZE + definition.localX) * vectorToMapScale
    const worldY = (tile.y * TILE_SIZE + definition.localY) * vectorToMapScale
    const x = worldX - mapWorldCenter.x + MAP_WIDTH / 2
    const y = worldY - mapWorldCenter.y + MAP_HEIGHT / 2

    if (x < -30 || x > MAP_WIDTH + 30 || y < -20 || y > MAP_HEIGHT + 20) {
      return []
    }

    return [
      {
        id: `${tile.x}-${tile.y}-${definition.id}`,
        text: definition.text,
        kind: definition.kind,
        x,
        y,
      },
    ]
  })
}

function rememberVectorTile(
  key: string,
  request: Promise<VectorTileLabelDefinition[]>
) {
  vectorTileLabelCache.delete(key)
  vectorTileLabelCache.set(key, request)

  if (vectorTileLabelCache.size > MAX_CACHED_VECTOR_TILES) {
    const oldestKey = vectorTileLabelCache.keys().next().value
    if (oldestKey) vectorTileLabelCache.delete(oldestKey)
  }
}

export function loadVectorTileLabels(
  tile: VectorTileCoordinates,
  zoom: number
): Promise<VectorTileLabelDefinition[]> {
  const key = `${zoom}/${tile.x}/${tile.y}`
  const cached = vectorTileLabelCache.get(key)
  if (cached) {
    rememberVectorTile(key, cached)
    return cached
  }

  const request: Promise<VectorTileLabelDefinition[]> = fetch(
    `/api/map-tiles/${key}`,
    { cache: 'force-cache' }
  )
    .then(async (response) => {
      if (!response.ok) return []
      return getVectorTileLabelDefinitions(await response.arrayBuffer())
    })
    .catch(() => {
      if (vectorTileLabelCache.get(key) === request) {
        vectorTileLabelCache.delete(key)
      }
      return []
    })

  rememberVectorTile(key, request)
  return request
}

export function getLabelFontSize(kind: LabelKind, zoom: number) {
  const zoomBoost = Math.max(0, zoom - 14)

  switch (kind) {
    case 'place':
      return 15 + zoomBoost * 1.5
    case 'street':
      return 13 + zoomBoost * 1.25
    case 'poi':
      return 12 + zoomBoost
    case 'house':
      return 11 + zoomBoost * 0.75
  }
}

export function getCollisionFreeLabels(labels: MapLabel[], zoom: number) {
  const occupied: Array<{
    left: number
    right: number
    top: number
    bottom: number
  }> = []
  const seen = new Set<string>()
  const kindCount: Record<LabelKind, number> = {
    place: 0,
    street: 0,
    poi: 0,
    house: 0,
  }

  return [...labels]
    .sort((left, right) => {
      const priority = LABEL_PRIORITY[right.kind] - LABEL_PRIORITY[left.kind]
      if (priority !== 0) return priority

      const leftDistance =
        Math.abs(left.x - MAP_WIDTH / 2) + Math.abs(left.y - MAP_HEIGHT / 2)
      const rightDistance =
        Math.abs(right.x - MAP_WIDTH / 2) + Math.abs(right.y - MAP_HEIGHT / 2)
      return leftDistance - rightDistance
    })
    .filter((label) => {
      const normalizedText = label.text.trim().toLowerCase()
      const duplicateKey = `${label.kind}:${normalizedText}`
      if (
        seen.has(duplicateKey) ||
        kindCount[label.kind] >= LABEL_LIMITS[label.kind]
      ) {
        return false
      }

      const fontSize = getLabelFontSize(label.kind, zoom)
      const box = {
        left: label.x - (label.text.length * fontSize * 0.55) / 2 - 7,
        right: label.x + (label.text.length * fontSize * 0.55) / 2 + 7,
        top: label.y - fontSize - 6,
        bottom: label.y + 7,
      }
      const intersects = occupied.some(
        (item) =>
          box.left < item.right &&
          box.right > item.left &&
          box.top < item.bottom &&
          box.bottom > item.top
      )
      if (intersects) return false

      seen.add(duplicateKey)
      kindCount[label.kind] += 1
      occupied.push(box)
      return true
    })
}
