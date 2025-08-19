'use client'

import styles from './Map.module.scss'

import { YMaps, Map as YMap, ZoomControl, Placemark } from '@pbe/react-yandex-maps'

interface MapProps {
    lng: number
    lat: number
    className?: string;
}

export function MapPlacement({ className, lat, lng }: MapProps) {
    const city = { lng: lng, lat: lat }
    const zoom = 17;

    const isMobile = false


    // Return a div with the ref attached
    return (
        <div className={styles['map-wrapper']}>
            <YMaps query={{ lang: 'ru_RU' }}>
                <YMap
                    defaultState={{
                        center: [city.lat, city.lng],
                        zoom: 17,
                        behaviors: isMobile ? ['multiTouch'] : ['drag'],
                    }}
                    height="400px"
                    width="100%"
                >
                    <ZoomControl />
                    <Placemark geometry={[city.lat, city.lng]} properties={{ hintContent: "Муниципальное образование" }} options={{ preset: 'islands#redDotIconWithCaption', iconColor: '#FF0000' }} />
                </YMap>
            </YMaps>
        </div>

    )
}