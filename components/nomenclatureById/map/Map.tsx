'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from '@/components/ui/button/Button'
import L from 'leaflet'

// Фикс для иконок в Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
})

interface MapProps {
  lng: number
  lat: number
  className?: string
}

export function MapPlacement({ className, lat, lng }: MapProps) {
  const [showMap, setShowMap] = useState(false)

  // Создаем кастомную иконку
  const customIcon = new L.Icon({
    iconUrl: '/marker.png', // Ваш маркер
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

  return (
    <>
      {!showMap ? (
        <Button
          onClick={() => setShowMap(true)}
          className="p-2 bg-blue-500 text-white rounded w-full"
        >
          Показать карту
        </Button>
      ) : (
        <div className="relative">
          <Button
            onClick={() => setShowMap(false)}
            className="p-2 bg-blue-500 text-white rounded w-full mb-2"
          >
            Скрыть карту
          </Button>
          
          <MapContainer
            center={[lat, lng]}
            zoom={17}
            scrollWheelZoom={true}
            style={{ height: '400px', width: '100%', borderRadius: '8px' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="topright" />
            <Marker position={[lat, lng]} icon={customIcon}>
              <Popup>
                Муниципальное образование
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </>
  )
}