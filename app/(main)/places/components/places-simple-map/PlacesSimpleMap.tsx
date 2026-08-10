'use client'

import {
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ComposableMap } from 'react-simple-maps'

import { getNomenclatureTitle } from '@/utils/nomenclatureUtils'

import {
  LABEL_LOAD_DELAY,
  MAP_HEIGHT,
  MAP_WIDTH,
  MAX_ZOOM,
  MIN_ZOOM,
  TILE_SIZE,
} from './constants'
import {
  fromWorldCoordinates,
  getCoordinates,
  getMapView,
  getProjectionScale,
  getTiles,
  getVectorTileCoordinates,
  toWorldCoordinates,
} from './mapMath'
import { MapLabels } from './MapLabels'
import { PlaceMarker } from './PlaceMarker'
import type {
  DragState,
  MapLabel,
  MapPoint,
  MapView,
  PlacesSimpleMapProps,
} from './types'
import {
  getCollisionFreeLabels,
  loadVectorTileLabels,
  projectVectorTileLabels,
} from './vectorTileLabels'

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay)
    return () => window.clearTimeout(timeoutId)
  }, [delay, value])

  return debouncedValue
}

export default function PlacesSimpleMap({
  places,
  cityName,
  selectedPlaceId,
  onPlaceSelect,
}: PlacesSimpleMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null)
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null)
  const [camera, setCamera] = useState<MapView | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [labels, setLabels] = useState<MapLabel[]>([])
  const dragState = useRef<DragState | null>(null)
  const activePlaceIdRef = useRef<string | null>(null)
  const isDraggingRef = useRef(false)
  const wasDragging = useRef(false)
  const animationFrameId = useRef<number | null>(null)
  const pendingCamera = useRef<MapView | null>(null)
  const onPlaceSelectRef = useRef(onPlaceSelect)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      if (animationFrameId.current !== null) {
        window.cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  useEffect(() => {
    onPlaceSelectRef.current = onPlaceSelect
  }, [onPlaceSelect])

  const points = useMemo<MapPoint[]>(
    () =>
      places.flatMap((place) => {
        const coordinates = getCoordinates(place)
        if (!coordinates) return []

        return [
          {
            place,
            coordinates,
            title: place.title || getNomenclatureTitle(place),
          },
        ]
      }),
    [places]
  )
  const initialView = useMemo(() => getMapView(points), [points])
  const view = camera ?? initialView
  const currentView = useRef<MapView | null>(null)
  const labelView = useDebouncedValue(view, LABEL_LOAD_DELAY)
  const tiles = useMemo(
    () => getTiles(view.center, view.zoom),
    [view.center, view.zoom]
  )
  const vectorTiles = useMemo(
    () => getVectorTileCoordinates(labelView),
    [labelView.center, labelView.zoom]
  )
  const activePlace = useMemo(
    () => points.find(({ place }) => place.id === activePlaceId),
    [activePlaceId, points]
  )

  const clearLabels = useCallback(() => {
    setLabels((currentLabels) =>
      currentLabels.length === 0 ? currentLabels : []
    )
  }, [])

  useEffect(() => {
    currentView.current = view
  }, [view])

  useEffect(() => {
    if (
      activePlaceIdRef.current &&
      !points.some(({ place }) => place.id === activePlaceIdRef.current)
    ) {
      activePlaceIdRef.current = null
      setActivePlaceId(null)
    }
  }, [points])

  useEffect(() => {
    if (isDragging) return

    let isCurrent = true

    const loadLabels = async () => {
      const labelsByTile = await Promise.all(
        vectorTiles.tiles.map(async (tile) =>
          projectVectorTileLabels(
            await loadVectorTileLabels(tile, vectorTiles.zoom),
            tile,
            vectorTiles.zoom,
            labelView
          )
        )
      )

      if (
        isCurrent &&
        !isDraggingRef.current &&
        currentView.current === labelView
      ) {
        setLabels(getCollisionFreeLabels(labelsByTile.flat(), labelView.zoom))
      }
    }

    void loadLabels()

    return () => {
      isCurrent = false
    }
  }, [isDragging, labelView, vectorTiles])

  const selectPlace = useCallback((placeId: string) => {
    const nextActivePlaceId =
      activePlaceIdRef.current === placeId ? null : placeId

    activePlaceIdRef.current = nextActivePlaceId
    setActivePlaceId(nextActivePlaceId)
    if (nextActivePlaceId) onPlaceSelectRef.current?.(placeId)
  }, [])

  const clearActivePlace = useCallback(() => {
    activePlaceIdRef.current = null
    setActivePlaceId(null)
  }, [])

  const changeZoom = useCallback(
    (delta: number) => {
      clearLabels()
      setCamera((currentCamera) => {
        const baseView = currentCamera ?? initialView
        return {
          ...baseView,
          zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, baseView.zoom + delta)),
        }
      })
    },
    [clearLabels, initialView]
  )

  const scheduleCameraUpdate = useCallback((nextView: MapView) => {
    pendingCamera.current = nextView
    if (animationFrameId.current !== null) return

    animationFrameId.current = window.requestAnimationFrame(() => {
      animationFrameId.current = null
      const cameraUpdate = pendingCamera.current
      pendingCamera.current = null
      if (cameraUpdate) setCamera(cameraUpdate)
    })
  }, [])

  const handleMapClick = useCallback(() => {
    if (wasDragging.current) {
      wasDragging.current = false
      return
    }
    clearActivePlace()
  }, [clearActivePlace])

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      const target = event.target as Element
      if (target.closest('.rsm-marker')) return

      event.currentTarget.setPointerCapture(event.pointerId)
      dragState.current = {
        clientX: event.clientX,
        clientY: event.clientY,
        view,
      }
      wasDragging.current = false
      isDraggingRef.current = true
      clearLabels()
      setIsDragging(true)
    },
    [clearLabels, view]
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      if (!dragState.current) return

      const rect = event.currentTarget.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const deltaX =
        ((event.clientX - dragState.current.clientX) * MAP_WIDTH) / rect.width
      const deltaY =
        ((event.clientY - dragState.current.clientY) * MAP_HEIGHT) / rect.height
      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        wasDragging.current = true
      }
      const worldCenter = toWorldCoordinates(
        dragState.current.view.center,
        dragState.current.view.zoom
      )

      scheduleCameraUpdate({
        center: fromWorldCoordinates(
          {
            x: worldCenter.x - deltaX,
            y: worldCenter.y - deltaY,
          },
          dragState.current.view.zoom
        ),
        zoom: dragState.current.view.zoom,
      })
    },
    [scheduleCameraUpdate]
  )

  const stopDragging = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      if (!dragState.current) return

      dragState.current = null
      isDraggingRef.current = false
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      setIsDragging(false)
    },
    []
  )

  const handlePointerCancel = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      dragState.current = null
      isDraggingRef.current = false
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      setIsDragging(false)
    },
    []
  )

  const handleWheel = useCallback(
    (event: ReactWheelEvent<SVGSVGElement>) => {
      event.preventDefault()
      changeZoom(event.deltaY < 0 ? 1 : -1)
    },
    [changeZoom]
  )

  if (!isMounted) {
    return <div className="h-full w-full bg-slate-100" aria-busy="true" />
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-100">
      <ComposableMap
        className={`h-full w-full touch-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        projection="geoMercator"
        projectionConfig={{
          center: view.center,
          scale: getProjectionScale(view.zoom),
        }}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        onClick={handleMapClick}
        onDoubleClick={() => changeZoom(1)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={handlePointerCancel}
        onWheel={handleWheel}
      >
        <defs>
          <clipPath id="api1-map-clip">
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} />
          </clipPath>
          <linearGradient id="api1-map-overlay" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.08" />
          </linearGradient>
          <filter
            id="api1-marker-shadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="4"
              floodColor="#991b1b"
              floodOpacity="0.35"
            />
          </filter>
        </defs>
        <g clipPath="url(#api1-map-clip)">
          {tiles.map((tile) => (
            <image
              key={tile.key}
              href={tile.href}
              x={tile.x}
              y={tile.y}
              width={TILE_SIZE}
              height={TILE_SIZE}
            />
          ))}
          <rect
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            fill="url(#api1-map-overlay)"
            pointerEvents="none"
          />
        </g>

        <MapLabels labels={labels} zoom={view.zoom} />

        {points.map((point) => {
          const isSelected =
            selectedPlaceId === point.place.id ||
            activePlaceId === point.place.id

          return (
            <PlaceMarker
              key={point.place.id}
              point={point}
              isSelected={isSelected}
              isHighlighted={isSelected || hoveredPlaceId === point.place.id}
              onSelect={selectPlace}
              onHoverChange={setHoveredPlaceId}
            />
          )
        })}
      </ComposableMap>

      <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
          {cityName || 'Карта площадок'}
        </div>
      </div>

      <div className="absolute right-4 top-4 overflow-hidden rounded-xl bg-white/95 shadow-sm ring-1 ring-slate-200 backdrop-blur">
        <button
          type="button"
          aria-label="Приблизить карту"
          className="flex h-10 w-10 items-center justify-center border-b border-slate-200 text-xl font-semibold text-slate-700 transition hover:bg-slate-100"
          onClick={() => changeZoom(1)}
        >
          +
        </button>
        <button
          type="button"
          aria-label="Отдалить карту"
          className="flex h-10 w-10 items-center justify-center text-xl font-semibold text-slate-700 transition hover:bg-slate-100"
          onClick={() => changeZoom(-1)}
        >
          −
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-4 rounded-lg bg-slate-900/75 px-2.5 py-1.5 text-[11px] text-white/90 backdrop-blur">
        Перетаскивайте карту · колесо — масштаб
      </div>

      <div className="pointer-events-none absolute bottom-3 right-4 text-[10px] font-medium text-slate-600">
        © RMC
      </div>

      {activePlace && (
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-3 shadow-lg backdrop-blur sm:left-auto sm:w-80">
          <div className="flex gap-3">
            {activePlace.place.exterior[0]?.source && (
              <img
                src={activePlace.place.exterior[0].source}
                alt="Фасад"
                className="h-16 w-24 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">
                {activePlace.title}
              </p>
              {activePlace.place.formattedAddress.name && (
                <p className="mt-1 text-xs text-slate-600">
                  {activePlace.place.formattedAddress.name}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {points.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-slate-600">
          Для отображения карты нужны координаты площадки из API1.
        </div>
      )}
    </div>
  )
}
