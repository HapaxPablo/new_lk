'use client'

import 'maplibre-gl/dist/maplibre-gl.css'

import maplibre, {
  type GeoJSONSource,
  type Map as MapLibreMap,
  type Popup,
} from 'maplibre-gl'
import { useEffect, useRef, useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

import {
  buildMapFeatureCollection,
  getMapBounds,
  isSafeMapUrl,
} from './adapters'
import type { MapMarker, UnifiedMapProps } from './types'

const SOURCE_ID = 'unified-map-markers'
const CLUSTERS_LAYER_ID = 'unified-map-clusters'
const CLUSTER_COUNT_LAYER_ID = 'unified-map-cluster-count'
const MARKERS_LAYER_ID = 'unified-map-markers-layer'

const DEFAULT_VIEW = {
  center: [92.52, 56] as [number, number],
  zoom: 4,
}

function createImage(url: string, alt: string, width: number, height: number) {
  if (!isSafeMapUrl(url)) return null

  const image = document.createElement('img')
  image.src = url
  image.alt = alt
  image.width = width
  image.height = height
  image.style.cssText =
    'display:block;max-width:100%;object-fit:cover;border-radius:8px;'
  return image
}

function createPopupContent(marker: MapMarker) {
  const content = document.createElement('div')
  content.className = 'flex max-w-60 flex-col gap-2 p-1 text-sm'

  const image = marker.imageUrl
    ? createImage(marker.imageUrl, 'Фасад площадки', 224, 112)
    : null
  if (image) content.append(image)

  const logo = marker.logoUrl
    ? createImage(marker.logoUrl, `Логотип ${marker.title}`, 112, 40)
    : null
  if (logo) content.append(logo)

  const title = document.createElement('strong')
  title.textContent = marker.title
  content.append(title)

  if (marker.address) {
    const address = document.createElement('span')
    address.textContent = marker.address
    content.append(address)
  }

  if (marker.href && isSafeMapUrl(marker.href)) {
    const link = document.createElement('a')
    link.href = marker.href
    link.textContent = 'Открыть площадку'
    link.className = 'text-primary underline underline-offset-4'
    content.append(link)
  }

  return content
}

export default function UnifiedMapCanvas({
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
  const popupRef = useRef<Popup | null>(null)
  const markersRef = useRef(markers)
  const initialViewRef = useRef(initialView)
  const clusterRef = useRef(cluster)
  const onMarkerSelectRef = useRef(onMarkerSelect)
  const showPopupRef = useRef(showPopup)
  const hasFittedRef = useRef(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    const styleUrl = process.env.NEXT_PUBLIC_MAP_LIBRE_STYLE_URL
    const container = containerRef.current
    if (!container || !styleUrl) {
      setError('Карта временно недоступна.')
      return
    }

    const map = new maplibre.Map({
      container,
      style: styleUrl,
      center: initialViewRef.current.center,
      zoom: initialViewRef.current.zoom,
      attributionControl: false,
      transformRequest: (url) => {
        if (!url.startsWith('/')) return { url }

        const tileServerUrl = process.env.NEXT_PUBLIC_MAP_TILE_SERVER_URL
        return tileServerUrl ? { url: `${tileServerUrl}${url}` } : { url }
      },
    })
    mapRef.current = map

    const showMarkerPopup = (marker: MapMarker) => {
      popupRef.current?.remove()
      if (!showPopupRef.current) return

      popupRef.current = new maplibre.Popup({
        anchor: 'bottom',
        closeButton: true,
      })
        .setLngLat(marker.coordinates)
        .setDOMContent(createPopupContent(marker))
        .addTo(map)
    }

    map.once('load', () => {
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
        filter: clusterRef.current ? ['!', ['has', 'point_count']] : undefined,
        paint: {
          'circle-color': '#ef4444',
          'circle-radius': 11,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
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

        showMarkerPopup(marker)
        onMarkerSelectRef.current?.(id)
      })

      const pointerLayers = clusterRef.current
        ? [CLUSTERS_LAYER_ID, MARKERS_LAYER_ID]
        : [MARKERS_LAYER_ID]
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
      if (mapRef.current !== map) return

      mapRef.current = null
      map.remove()
      setIsReady(false)
      setError('Карта временно недоступна.')
    })

    return () => {
      popupRef.current?.remove()
      popupRef.current = null
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
    popupRef.current?.remove()
    if (showPopup) {
      popupRef.current = new maplibre.Popup({
        anchor: 'bottom',
        closeButton: true,
      })
        .setLngLat(marker.coordinates)
        .setDOMContent(createPopupContent(marker))
        .addTo(map)
    }
  }, [isReady, markers, selectedMarkerId, showPopup])

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
      {isReady && !markers.length && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/75 p-4 text-center text-sm text-muted-foreground">
          Для выбранных условий нет точек на карте.
        </div>
      )}
    </div>
  )
}
