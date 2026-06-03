'use client'

import { useEffect, useRef, useState } from 'react'
import maplibre, { Map, Popup, LngLatBounds } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import { ICity } from '@/types/cities'

interface PlacesMapProps {
  places: ICity[]
  cityName: string
  selectedPlaceId?: string | null
  onPlaceSelect?: (placeId: string) => void
}

interface GeoJSONFeature {
  type: 'Feature'
  geometry: { type: 'Point'; coordinates: [number, number] }
  properties: { id: string; title: string; address: string | null; brand: string }
}

const normalizeCoordinates = (place: ICity): [number, number] | null => {
  const { latitude, longitude } = place.formattedAddress.coordinates
  if (latitude == null || longitude == null) return null
  const lat = parseFloat(latitude)
  const lng = parseFloat(longitude)
  if (isNaN(lat) || isNaN(lng)) return null
  if (lat < 41 || lat > 82 || lng < 19 || lng > 169) return null
  return [lng, lat]
}

const buildGeoJSON = (places: ICity[]) => {
  const features: GeoJSONFeature[] = []
  places.forEach((place) => {
    const coords = normalizeCoordinates(place)
    if (!coords) return
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: coords },
      properties: {
        id: place.id,
        title: place.nameForFront,
        address: place.formattedAddress.name,
        brand: place.brand.name,
      },
    })
  })
  return { type: 'FeatureCollection' as const, features }
}

export default function PlacesMap({
  places,
  cityName,
  selectedPlaceId,
  onPlaceSelect,
}: PlacesMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<Map | null>(null)
  const popup = useRef<Popup | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showMobileMap, setShowMobileMap] = useState(false)

  useEffect(() => {
    if (!mapContainer.current) return

    const initMap = async () => {
      try {
        // const styleUrl =
        //   process.env.NEXT_PUBLIC_MAP_STYLE_URL ||
        //   'http://192.168.0.8:7777/styles/basic/style.json' dev

        const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL
        if (!styleUrl) {
          setError('Карта временно недоступна')
          return
        }

        map.current = new maplibre.Map({
          container: mapContainer.current!,
          style: styleUrl,
          center: [37.62, 55.75],
          zoom: 10,
          // transformRequest: (url) => {
          //   if (url.startsWith('/')) {
          //     const tileBase =
          //       process.env.NEXT_PUBLIC_MAP_TILE_SERVER_URL ||
          //       'http://192.168.0.8:7777'
          //     return { url: `${tileBase}${url}` }
          //   }
          //   return { url }
          // }, dev
          transformRequest: (url) => {
            if (url.startsWith('/')) {
              const tileBase = process.env.NEXT_PUBLIC_MAP_TILE_SERVER_URL
              if (!tileBase) return { url }
              return { url: `${tileBase}${url}` }
            }
            return { url }
          },
        })

        // once('idle') вместо on('load') — срабатывает даже если отдельные
        // source упали с ошибкой (например, vector tiles 404)
        map.current.once('idle', () => {
          if (!map.current) return

          const geojson = buildGeoJSON(places)

          map.current.addSource('places', {
            type: 'geojson',
            data: geojson,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
          })

          map.current.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'places',
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': '#3b82f6',
              'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
              'circle-opacity': 0.8,
            },
          })

          map.current.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'places',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': ['get', 'point_count'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-size': 12,
              'text-allow-overlap': true,
            },
            paint: { 'text-color': '#fff' },
          })

          map.current.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'places',
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-color': '#ef4444',
              'circle-radius': 8,
              'circle-opacity': 0.8,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff',
            },
          })

          map.current.on('click', 'clusters', (e) => {
            const clusterId = (e.features?.[0]?.properties as any)?.cluster_id
            const source = map.current?.getSource('places') as any
            if (!source || !clusterId) return
            source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
              if (err || !map.current || !e.features?.[0]) return
              map.current.easeTo({
                center: (e.features[0].geometry as any).coordinates,
                zoom,
              })
            })
          })

          map.current.on('click', 'unclustered-point', (e) => {
            if (!map.current || !e.features?.[0]) return
            const feature = e.features[0]
            const coordinates = (feature.geometry as any).coordinates
            const props = feature.properties as any
            popup.current?.remove()
            popup.current = new Popup({ offset: 25, closeButton: true })
              .setLngLat(coordinates)
              .setHTML(
                `<div class="text-sm"><strong>${props.address || props.title}</strong><br/><span class="text-gray-600">${props.brand}</span></div>`
              )
              .addTo(map.current)
            onPlaceSelect?.(props.id)
          })

          map.current.on('mouseenter', 'clusters', () => {
            if (map.current) map.current.getCanvas().style.cursor = 'pointer'
          })
          map.current.on('mouseleave', 'clusters', () => {
            if (map.current) map.current.getCanvas().style.cursor = ''
          })
          map.current.on('mouseenter', 'unclustered-point', () => {
            if (map.current) map.current.getCanvas().style.cursor = 'pointer'
          })
          map.current.on('mouseleave', 'unclustered-point', () => {
            if (map.current) map.current.getCanvas().style.cursor = ''
          })

          // fitBounds на все точки
          const validCoords = places
            .map(normalizeCoordinates)
            .filter((c): c is [number, number] => c !== null)

          if (validCoords.length > 0) {
            const bounds = validCoords.reduce(
              (acc, coord) => acc.extend(coord),
              new LngLatBounds(validCoords[0], validCoords[0])
            )
            map.current.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 0 })
          }

          setIsLoaded(true)
        })

        map.current.on('error', (e) => {
          const msg = e.error?.message ?? ''
          console.warn('MapLibre error:', msg)
          // Фатально только если сам style.json недоступен
          if (msg.includes('Failed to fetch') && msg.includes('style')) {
            setError('Карта временно недоступна')
          }
        })
      } catch (err) {
        setError('Карта временно недоступна')
      }
    }

    initMap()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [places, onPlaceSelect])

  useEffect(() => {
    if (!map.current || !isLoaded || !selectedPlaceId) return
    const place = places.find((p) => p.id === selectedPlaceId)
    if (!place) return
    const coords = normalizeCoordinates(place)
    if (!coords) return
    map.current.flyTo({ center: coords, zoom: 15, duration: 1000 })
    popup.current?.remove()
    popup.current = new Popup({ offset: 25, closeButton: true })
      .setLngLat(coords)
      .setHTML(
        `<div class="text-sm"><strong>${place.formattedAddress.name || place.nameForFront}</strong><br/><span class="text-gray-600">${place.brand.name}</span></div>`
      )
      .addTo(map.current)
  }, [selectedPlaceId, places, isLoaded])

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4">
        <p className="text-gray-600 text-center">{error}</p>
        <p className="text-sm text-gray-500 mt-2">Попробуйте обновить страницу позже.</p>
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block h-full">
        <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
      </div>

      <div className="md:hidden w-full">
        {!showMobileMap ? (
          <button
            onClick={() => setShowMobileMap(true)}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Показать карту
          </button>
        ) : (
          <div className="space-y-2">
            <div ref={mapContainer} className="w-full h-96 rounded-lg overflow-hidden" />
            <button
              onClick={() => setShowMobileMap(false)}
              className="w-full py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors"
            >
              Скрыть карту
            </button>
          </div>
        )}
      </div>
    </>
  )
}