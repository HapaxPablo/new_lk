'use client'

import { useState } from 'react'
import styles from './Map.module.scss'

import {
  YMaps,
  Map as YMap,
  ZoomControl,
  Placemark,
} from '@pbe/react-yandex-maps'
import { Button } from '@/components/ui/button/Button'

interface MapProps {
  lng: number
  lat: number
  className?: string
}

export function MapPlacement({ className, lat, lng }: MapProps) {
  const [showMap, setShowMap] = useState(false)

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
        <div className={styles['map-wrapper']}>
          <Button
            onClick={() => setShowMap(false)}
            className="p-2 bg-blue-500 text-white rounded w-full"
          >
            Скрыть карту
          </Button>
          <YMaps query={{ lang: 'ru_RU' }}>
            <YMap
              defaultState={{
                center: [lat, lng],
                zoom: 17,
                behaviors: ['drag'],
              }}
              height="400px"
              width="100%"
            >
              <ZoomControl />
              <Placemark
                geometry={[lat, lng]}
                properties={{ hintContent: 'Муниципальное образование' }}
                options={{
                  preset: 'islands#redDotIconWithCaption',
                  iconColor: '#FF0000',
                }}
              />
            </YMap>
          </YMaps>
        </div>
      )}
    </>
  )
}
