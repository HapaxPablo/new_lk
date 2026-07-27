'use client'

import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'

interface MapProps {
  lng: number
  lat: number
  className?: string
  address?: string
  zoom?: number
}

export function MapPlacement({ className, lat, lng, address, zoom }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [mapInstance, setMapInstance] = useState<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance) return

    // Загружаем API
    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_MAP}&lang=ru_RU`
    script.async = true

    script.onload = () => {
      // @ts-ignore
      ymaps.ready(() => {
        // @ts-ignore
        const map = new ymaps.Map(mapRef.current, {
          center: [lat, lng],
          zoom: zoom ? zoom : 15,
          controls: ['zoomControl'], // только кнопки зума
        })

        // Отключаем ВСЕ нежелательные поведения
        map.behaviors.disable(
          isMobile
            ? [
              'drag', // перетаскивание
              'scrollZoom', // зум колесом
              'dblClickZoom', // зум двойным кликом
              'multiTouch', // мультитач на мобильных - ВАЖНО!
              'rightMouseButtonMagnifier',
            ]
            : [
              // 'drag', // перетаскивание
              'scrollZoom', // зум колесом
              'dblClickZoom', // зум двойным кликом
              'multiTouch', // мультитач на мобильных - ВАЖНО!
              'rightMouseButtonMagnifier',
            ]
        )

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
  }, [lat, lng, address])

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className={`w-full h-55 rounded-lg overflow-hidden ${className}`}
      />
    </div>
  )
}
