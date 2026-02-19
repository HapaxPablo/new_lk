'use client'

import { useState } from 'react'
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
  const isMobile = useMediaQuery('(max-width: 600px)')

  const desktopUrl = `https://yandex.ru/map-widget/v1/?ll=${lng},${lat}&z=17&l=map&pt=${lng},${lat},pm2rdl&scroll=false`
  const mobileUrl = `https://yandex.ru/map-widget/v1/?ll=${lng},${lat}&z=17&l=map&pt=${lng},${lat},pm2rdl&scroll=false&drag=false`

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

          <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
            <iframe
              src={isMobile ? mobileUrl : desktopUrl}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              allowFullScreen
              className={styles['map-iframe']}
              title="Яндекс Карта"
            />
          </div>
        </div>
      )}
    </>
  )
}
