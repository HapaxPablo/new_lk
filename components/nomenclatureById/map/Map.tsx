'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button/Button'

interface MapProps {
  lng: number
  lat: number
  className?: string
  address?: string
}

export function MapPlacement({ className, lat, lng, address }: MapProps) {
  const [showMap, setShowMap] = useState(false)

  const yandexMapUrl = `https://yandex.ru/map-widget/v1/?ll=${lng},${lat}&z=17&l=map&pt=${lng},${lat},pm2rdl`

  const handleShowMap = () => {
    setShowMap(true)
  }

  const handleHideMap = () => {
    setShowMap(false)
  }

  return (
    <div className={className}>
      {!showMap ? (
        <Button
          onClick={handleShowMap}
          variant="default"
          className="w-full"
        >
          Показать карту
        </Button>
      ) : (
        <div className="space-y-2">
          <Button
            onClick={handleHideMap}
            variant="primary"
            className="w-full"
          >
            Скрыть карту
          </Button>
          
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-gray-200">
            <iframe
              src={yandexMapUrl}
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen
              title={`Карта: ${address || 'местоположение'}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
            <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs">
              <a 
                href={`https://yandex.ru/maps/?ll=${lng},${lat}&z=17&l=map&pt=${lng},${lat},pm2rdl`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Открыть в Яндекс.Картах
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}