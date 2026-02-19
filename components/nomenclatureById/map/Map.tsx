'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button/Button'
import styles from './Map.module.scss'
import { useMediaQuery } from 'usehooks-ts'

interface MapProps {
  lng: number
  lat: number
  className?: string
  address?: string
}

export function MapPlacement({ className, lat, lng, address }: MapProps) {
  const [showMap, setShowMap] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [mapInstance, setMapInstance] = useState<any>(null)

  useEffect(() => {
    if (!showMap || !mapRef.current || mapInstance) return

    // Загружаем API
    const script = document.createElement('script')
    script.src = ''// TODO добавить ключ апи яндекс карт
    script.async = true

    script.onload = () => {
      // @ts-ignore
      ymaps.ready(() => {
        // @ts-ignore
        const map = new ymaps.Map(mapRef.current, {
          center: [lat, lng],
          zoom: 17,
          controls: ['zoomControl'], // только кнопки зума
        })

        // Отключаем ВСЕ нежелательные поведения
        map.behaviors.disable([
          // 'drag', // перетаскивание
          'scrollZoom', // зум колесом
          'dblClickZoom', // зум двойным кликом
          'multiTouch', // мультитач на мобильных - ВАЖНО!
          'rightMouseButtonMagnifier',
        ])

        // Добавляем метку
        // @ts-ignore
        const placemark = new ymaps.Placemark([lat, lng], {
          hintContent: address,
          balloonContent: address,
        })
        map.geoObjects.add(placemark)

        setMapInstance(map)
      })
    }

    document.body.appendChild(script)

    return () => {
      if (mapInstance) {
        mapInstance.destroy()
      }
    }
  }, [showMap, lat, lng, address])

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

          <div
            ref={mapRef}
            className="w-full h-[400px] rounded-lg overflow-hidden"
          />
        </div>
      )}
    </>
  )
}
