'use client'

import { useEffect, useRef, useState } from 'react'
// import maplibre, { Map, Popup, LngLatBounds } from 'maplibre-gl'
import * as maplibre from 'maplibre-gl'
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
  properties: {
    id: string
    title: string
    address: string | null
    brand: string
    exterior: any
  }
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
        exterior: place.exterior,
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
  const map = useRef<maplibre.Map | null>(null)
  const popup = useRef<maplibre.Popup | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!mapContainer.current) return

    const initMap = async () => {
      try {
        const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL
        // console.log('Using map style URL:', styleUrl)
        if (!styleUrl) {
          setError('Карта временно недоступна')
          return
        }

        map.current = new maplibre.Map({
          container: mapContainer.current!,
          style: styleUrl,
          center: [92.52, 56.0],
          attributionControl: false,
          zoom: 10,
          transformRequest: (url) => {
            if (url.startsWith('/')) {
              const tileBase = process.env.NEXT_PUBLIC_MAP_TILE_SERVER_URL
              // console.log('Using map tileBase URL:', tileBase)
              if (!tileBase) return { url }
              return { url: `${tileBase}${url}` }
            }
            return { url }
          },
        })

        map.current.once('idle', () => {
          if (!map.current) return

          const style = map.current.getStyle()
          const layers = style?.layers || []

          const hidePatterns = [
            'landcover', // покрытие земли
            'aeroway', // аэропорты
            'contour', // горизонтали
            'hillshade', // тени рельефа
          ]

          layers.forEach((layer: any) => {
            const layerId = layer.id.toLowerCase()
            const shouldHide = hidePatterns.some((pattern) =>
              layerId.includes(pattern)
            )

            if (shouldHide && layer.type !== 'background') {
              try {
                map.current?.setLayoutProperty(layer.id, 'visibility', 'none')
              } catch (e) {
                // Пропускаем слои, которые нельзя изменить
              }
            }
          })

          const geojson = buildGeoJSON(places)

          map.current.addSource('places', {
            type: 'geojson',
            data: geojson,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
          })

          // Кластеры — кружки
          map.current.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'places',
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': '#3b82f6',
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                // zoom 0-10: маленькие кластеры
                0,
                15,
                10,
                ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
                // zoom 10-15: увеличиваются
                12,
                ['step', ['get', 'point_count'], 30, 100, 45, 750, 60],
                // zoom 15+: ещё больше
                15,
                ['step', ['get', 'point_count'], 40, 100, 60, 750, 80],
                18,
                ['step', ['get', 'point_count'], 55, 100, 80, 750, 100],
              ],
              'circle-opacity': 0.8,
            },
          })

          // Количество внутри кластеров
          map.current.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'places',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': ['get', 'point_count'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                10,
                10,
                12,
                14,
                16,
                18,
                22,
              ],
              'text-allow-overlap': true,
            },
            paint: { 'text-color': '#fff' },
          })

          // Одиночные точки — кружки побольше
          map.current.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'places',
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-color': '#ef4444',
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                10, // на минимальном зуме — маленький
                10,
                20, // средний зум
                14,
                30, // большой зум
                18,
                45, // максимальный зум
              ],
              'circle-opacity': 0.85,
              'circle-stroke-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                1,
                14,
                2,
                18,
                3,
              ],
              'circle-stroke-color': '#fff',
            },
          })

          // Текст nameForFront внутри одиночных кружков
          map.current.addLayer({
            id: 'unclustered-point-label',
            type: 'symbol',
            source: 'places',
            filter: ['!', ['has', 'point_count']],
            layout: {
              'text-field': ['get', 'title'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                7, // мелкий текст на дальнем зуме
                10,
                9,
                14,
                11,
                18,
                14, // крупный текст на близком зуме
              ],
              'text-max-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                6, // мало места — сильнее обрезаем
                10,
                8,
                14,
                12,
                18,
                15, // много места — показываем больше текста
              ],
              'text-line-height': 1.1,
              'text-allow-overlap': false,
              'text-optional': false,
              'text-ignore-placement': false,
            },
            paint: {
              'text-color': 'black',
              'text-halo-color': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                '#ef4444',
                14,
                'rgba(239, 68, 68, 0.5)',
                18,
                'rgba(239, 68, 68, 0)',
              ],
              'text-halo-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                1.5,
                18,
                0,
              ],
            },
          })

          // Универсальный обработчик клика по карте
          map.current.on('click', (e) => {
            if (!map.current) return

            // Ищем кластеры под курсором
            const clusterFeatures = map.current.queryRenderedFeatures(e.point, {
              layers: ['clusters'],
            })

            // Ищем одиночные точки под курсором
            const pointFeatures = map.current.queryRenderedFeatures(e.point, {
              layers: ['unclustered-point'],
            })

            // Если есть кластер и кликнули именно по нему (не мимо)
            if (clusterFeatures.length > 0) {
              const feature = clusterFeatures[0]

              // Дополнительная проверка: расстояние от центра кружка до точки клика
              const coordinates = (feature.geometry as any).coordinates
              const clickPoint = map.current.project(coordinates)
              const distance = Math.sqrt(
                Math.pow(e.point.x - clickPoint.x, 2) +
                  Math.pow(e.point.y - clickPoint.y, 2)
              )

              // Радиус кружка кластера (возьмите из вашего circle-radius, примерно)
              const radius = 25

              if (distance <= radius && feature.properties?.cluster_id) {
                const source = map.current.getSource('places') as any
                if (!source) return

                source.getClusterExpansionZoom(
                  feature.properties.cluster_id,
                  (err: any, expansionZoom: number) => {
                    if (err || !map.current) return

                    const currentZoom = map.current.getZoom()
                    const targetZoom = Math.min(currentZoom + 2, expansionZoom)

                    map.current.easeTo({
                      center: coordinates,
                      zoom: targetZoom,
                      duration: 500,
                    })
                  }
                )
              }
              return // Если кликнули по кластеру — выходим
            }

            // Если есть одиночная точка
            if (pointFeatures.length > 0) {
              const feature = pointFeatures[0]
              const coordinates = (feature.geometry as any).coordinates
              const props = feature.properties as any
              console.log('props.exterior', props.exterior)
              popup.current?.remove()
              popup.current = new maplibre.Popup({
                anchor: 'top',
                closeButton: true,
              })
                .setLngLat(coordinates)
                .setHTML(
                  `<div class="text-sm flex flex-col gap-2">
          <div class="flex flex-col items-center justify-center gap-2">
            <img
              src=${
                Array.isArray(props.exterior)
                  ? props.exterior[0]?.source
                  : props.exterior
              }
              alt="Фасад"
              style="
                width:160px;
                height:80px;
                object-fit:cover;
                border-radius:8px;
                display:block;"
            />
            <img
              src=${props.brand.logotype}
              alt="Логотип"
              style="
                width:80px;
                height:25px;
                object-fit:cover;
                display:block;"
            />
          </div>
          <strong>
            ${props.formattedAddress || props.nameForFront}
          </strong>
          <span class="text-gray-600">
            ${props.brand.name}
          </span>
        </div>`
                )
                .addTo(map.current)
              onPlaceSelect?.(props.id)
            }
          })

          // Курсоры
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
              new maplibre.LngLatBounds(validCoords[0], validCoords[0])
            )
            map.current.fitBounds(bounds, {
              padding: 60,
              maxZoom: 14,
              duration: 0,
            })
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
    map.current.flyTo({ center: coords, zoom: 13, duration: 2000 })
    console.log('place.exterior', place.exterior)

    popup.current?.remove()
    popup.current = new maplibre.Popup({ anchor: 'top', closeButton: true })
      .setLngLat(coords)
      .setHTML(
        `<div class="text-sm flex flex-col gap-2">
          <div class="flex flex-col items-center justify-center gap-2">
            <img
              src=${
                Array.isArray(place.exterior)
                  ? place.exterior[0]?.source
                  : place.exterior
              }
              alt="Фасад"
              style="
                width:160px;
                height:80px;
                object-fit:cover;
                border-radius:8px;
                display:block;"
            />
            <img
              src=${place.brand.logotype}
              alt="Логотип"
              style="
                width:80px;
                height:25px;
                object-fit:cover;
                display:block;"
            />
          </div>
          <strong>
            ${place.formattedAddress.name || place.nameForFront}
          </strong>
          <span class="text-gray-600">
            ${place.brand.name}
          </span>
        </div>`
      )
      .addTo(map.current)
  }, [selectedPlaceId, places, isLoaded])

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4">
        <p className="text-gray-600 text-center">{error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Попробуйте обновить страницу позже.
        </p>
      </div>
    )
  }

  return (
    <div className="block h-full">
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg overflow-hidden"
      />
    </div>
  )
}
