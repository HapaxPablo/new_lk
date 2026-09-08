'use client'

import 'maplibre-gl/dist/maplibre-gl.css'

import {
  type GeoJSONSource,
  Map as MapLibreMap,
  NavigationControl,
  setWorkerUrl,
} from 'maplibre-gl'
import { Maximize2 } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import { ModalWrapper } from '@/components/modal/ModalWrapper'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useModal } from '@/providers/modal/ModalProvider'

import {
  buildMapFeatureCollection,
  getMapBounds,
  isSafeMapUrl,
} from './adapters'
import type { UnifiedMapProps } from './types'
import { secureMapUrl } from '@/utils/mapUrl'
import { AddButtonToOrder } from '../ui/button/AddButtonToOrder'
import { AddToCartButton } from '../ui/card/AddToCartButton'

const SOURCE_ID = 'unified-map-markers'
const CLUSTERS_LAYER_ID = 'unified-map-clusters'
const CLUSTER_COUNT_LAYER_ID = 'unified-map-cluster-count'
const MARKERS_LAYER_ID = 'unified-map-markers-layer'
const MARKER_LABEL_LAYER_ID = 'unified-map-marker-labels'

setWorkerUrl('/maplibre/maplibre-gl-worker.mjs')

const DEFAULT_VIEW = {
  center: [92.52, 56] as [number, number],
  zoom: 4,
}

function MapSurface({
  markers,
  initialView = DEFAULT_VIEW,
  selectedMarkerId = null,
  onMarkerSelect,
  interaction = 'full',
  cluster = true,
  showPopup = true,
  fit = 'none',
  className,
}: UnifiedMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markersRef = useRef(markers)
  const initialViewRef = useRef(initialView)
  const clusterRef = useRef(cluster)
  const interactionRef = useRef(interaction)
  const onMarkerSelectRef = useRef(onMarkerSelect)
  const showPopupRef = useRef(showPopup)
  const hasFittedRef = useRef(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openedMarkerId, setOpenedMarkerId] = useState<string | null>(null)
  const [dismissedMarkerId, setDismissedMarkerId] = useState<string | null>(
    null
  )

  const preferredMarkerId = selectedMarkerId ?? openedMarkerId
  const activeMarker =
    preferredMarkerId && preferredMarkerId !== dismissedMarkerId
      ? (markers.find((marker) => marker.id === preferredMarkerId) ?? null)
      : null

  useEffect(() => {
    markersRef.current = markers
  }, [markers])

  useEffect(() => {
    onMarkerSelectRef.current = onMarkerSelect
  }, [onMarkerSelect])

  useEffect(() => {
    showPopupRef.current = showPopup
  }, [showPopup])

  useEffect(() => {
    const styleUrl = secureMapUrl(process.env.NEXT_PUBLIC_MAP_LIBRE_STYLE_URL)
    const container = containerRef.current
    if (!container || !styleUrl) {
      setError('Карта временно недоступна.')
      return
    }

    const map = new MapLibreMap({
      container,
      style: styleUrl,
      center: initialViewRef.current.center,
      zoom: initialViewRef.current.zoom,
      interactive: interactionRef.current !== 'static',
      attributionControl: false,
      transformRequest: (url) => {
        if (!url.startsWith('/')) return { url }

        const tileServerUrl = secureMapUrl(
          process.env.NEXT_PUBLIC_MAP_TILE_SERVER_URL
        )
        return tileServerUrl ? { url: `${tileServerUrl}${url}` } : { url }
      },
    })
    mapRef.current = map
    let hasLoaded = false

    map.addControl(new NavigationControl({ showCompass: false }), 'top-right')

    map.once('load', () => {
      hasLoaded = true
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: buildMapFeatureCollection(markersRef.current),
        cluster: clusterRef.current,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      })

      if (clusterRef.current) {
        map.addLayer({
          id: CLUSTERS_LAYER_ID,
          type: 'circle',
          source: SOURCE_ID,
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': '#2563eb',
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              18,
              20,
              24,
              100,
              32,
            ],
            'circle-opacity': 0.9,
          },
        })
        map.addLayer({
          id: CLUSTER_COUNT_LAYER_ID,
          type: 'symbol',
          source: SOURCE_ID,
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-size': 12,
          },
          paint: { 'text-color': '#ffffff' },
        })
      }

      map.addLayer({
        id: MARKERS_LAYER_ID,
        type: 'circle',
        source: SOURCE_ID,
        ...(clusterRef.current
          ? { filter: ['!', ['has', 'point_count']] }
          : {}),
        paint: {
          'circle-color': '#ef4444',
          'circle-radius': 26,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
        },
      })
      map.addLayer({
        id: MARKER_LABEL_LAYER_ID,
        type: 'symbol',
        source: SOURCE_ID,
        ...(clusterRef.current
          ? { filter: ['!', ['has', 'point_count']] }
          : {}),
        layout: {
          'text-field': ['concat', ['slice', ['get', 'title'], 0, 11], '…'],
          'text-size': 9,
          'text-max-width': 6,
          'text-allow-overlap': false,
          'text-ignore-placement': false,
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#ef4444',
          'text-halo-width': 2,
        },
      })

      if (clusterRef.current) {
        map.on('click', CLUSTERS_LAYER_ID, async (event) => {
          const feature = event.features?.[0]
          const clusterId = feature?.properties?.cluster_id
          if (typeof clusterId !== 'number' || !feature) return

          const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined
          const coordinates =
            feature.geometry.type === 'Point'
              ? (feature.geometry.coordinates as [number, number])
              : null
          if (!source || !coordinates) return

          const zoom = await source.getClusterExpansionZoom(clusterId)
          map.easeTo({ center: coordinates, zoom, duration: 400 })
        })
      }

      map.on('click', MARKERS_LAYER_ID, (event) => {
        const id = event.features?.[0]?.properties?.id
        if (typeof id !== 'string') return

        const marker = markersRef.current.find((item) => item.id === id)
        if (!marker) return

        if (showPopupRef.current) {
          setDismissedMarkerId(null)
          setOpenedMarkerId(marker.id)
        }
        map.flyTo({
          center: marker.coordinates,
          zoom: Math.max(map.getZoom(), 13),
          essential: true,
        })
        onMarkerSelectRef.current?.(id)
      })

      const pointerLayers = clusterRef.current
        ? [CLUSTERS_LAYER_ID, MARKERS_LAYER_ID, MARKER_LABEL_LAYER_ID]
        : [MARKERS_LAYER_ID, MARKER_LABEL_LAYER_ID]
      for (const layer of pointerLayers) {
        map.on('mouseenter', layer, () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', layer, () => {
          map.getCanvas().style.cursor = ''
        })
      }

      setIsReady(true)
    })

    map.on('error', () => {
      if (hasLoaded || mapRef.current !== map) return

      mapRef.current = null
      map.remove()
      setIsReady(false)
      setError('Карта временно недоступна.')
    })

    return () => {
      if (mapRef.current === map) {
        map.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const source = map?.getSource(SOURCE_ID) as GeoJSONSource | undefined
    if (!map || !source || !isReady) return

    source.setData(buildMapFeatureCollection(markers))
  }, [isReady, markers])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !isReady) return

    const controls = [
      map.dragPan,
      map.scrollZoom,
      map.boxZoom,
      map.dragRotate,
      map.keyboard,
      map.doubleClickZoom,
      map.touchZoomRotate,
    ]
    controls.forEach((control) => {
      if (interaction === 'static') control.disable()
      else control.enable()
    })
  }, [interaction, isReady])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !isReady || fit !== 'markers' || hasFittedRef.current) return

    const bounds = getMapBounds(markers)
    if (!bounds) return

    map.fitBounds(bounds, { padding: 48, maxZoom: 14, duration: 0 })
    hasFittedRef.current = true
  }, [fit, isReady, markers])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !isReady || !selectedMarkerId) return

    const marker = markers.find((item) => item.id === selectedMarkerId)
    if (!marker) return

    map.flyTo({ center: marker.coordinates, zoom: Math.max(map.getZoom(), 13) })
  }, [isReady, markers, selectedMarkerId])

  if (error) {
    return (
      <Alert variant="destructive" className={`h-full ${className ?? ''}`}>
        <AlertTitle>Карта недоступна</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={`relative h-full w-full ${className ?? ''}`}>
      {!isReady && <Skeleton className="absolute inset-0 z-10 h-full w-full" />}
      <div
        ref={containerRef}
        className="h-full w-full"
        aria-label="Карта площадок"
      />
      {isReady && showPopup && activeMarker && (
        <section
          aria-label={`Карточка площадки: ${activeMarker.title}`}
          className="absolute bottom-12 right-3 z-20 w-[min(15rem,calc(100%-1.5rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          <button
            type="button"
            onClick={() => setDismissedMarkerId(activeMarker.id)}
            className="absolute right-1.5 top-1.5 z-10 flex size-7 items-center justify-center rounded-full bg-white/90 text-lg leading-none text-slate-600 shadow-sm hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Закрыть карточку площадки"
          >
            ×
          </button>
          <div className="flex flex-col gap-2 p-2.5 text-sm">
            <div className="flex shrink-0 flex-col gap-2">
              {activeMarker.imageUrl && isSafeMapUrl(activeMarker.imageUrl) && (
                <img
                  src={activeMarker.imageUrl}
                  alt="Фасад площадки"
                  className="w-full shrink-0 rounded-lg object-cover"
                />
              )}
              {activeMarker.logoUrl && isSafeMapUrl(activeMarker.logoUrl) && (
                <img
                  src={activeMarker.logoUrl}
                  alt="Логотип бренда"
                  className="w-full shrink-0 rounded-lg object-cover"
                />
              )}
            </div>
            <div className="min-w-0 space-y-1 flex flex-col gap-2 justify-center items-center">
              <h3
                className="line-clamp-2 pr-5 font-semibold text-slate-950"
                title={activeMarker.title}
              >
                {activeMarker.title}
              </h3>
              {activeMarker.address && (
                <p className="line-clamp-3 text-xs text-slate-600">
                  {activeMarker.address}
                </p>
              )}
              {activeMarker.href && isSafeMapUrl(activeMarker.href) && (
                <a
                  href={activeMarker.href}
                  className="inline-flex text-base font-medium text-primary! underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Открыть расшифровку
                </a>
              )}
              <AddToCartButton item={activeMarker} />
            </div>
          </div>
        </section>
      )}
      {isReady && !markers.length && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/75 p-4 text-center text-sm text-muted-foreground">
          Для выбранных условий нет точек на карте.
        </div>
      )}
    </div>
  )
}

export default function UnifiedMapCanvas(props: UnifiedMapProps) {
  const modalKey = useId()
  const { openModal } = useModal('map', modalKey)
  const { className, ...mapProps } = props

  return (
    <div className={`relative h-full w-full ${className ?? ''}`}>
      <MapSurface {...mapProps} interaction="static" />
      <button
        type="button"
        onClick={openModal}
        className="absolute left-3 top-3 z-30 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-md ring-1 ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Открыть карту на весь экран"
      >
        <Maximize2 size={18} aria-hidden="true" />
        На весь экран
      </button>

      <ModalWrapper id="map" keyId={modalKey} title="Карта площадок" fullScreen>
        <div className="h-full min-h-0 w-full">
          <MapSurface {...mapProps} interaction="full" />
        </div>
      </ModalWrapper>
    </div>
  )
}
