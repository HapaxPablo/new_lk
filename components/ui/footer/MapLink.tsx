'use client'
import styles from './MapLink.module.scss'
import { MapPin } from 'lucide-react'
const MapLink = () => {
  const yandexMapsUrl = `https://yandex.ru/maps/?text=${encodeURIComponent('ООО АРЭМСИ 24, Красноярск, ул. Красной Армии, 10с3')}`

  const handleAddressClick = () => {
    window.open(yandexMapsUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      onClick={handleAddressClick}
      className={styles.footer__address}
      aria-label="Открыть адрес на Яндекс.Картах"
    >
      <MapPin size={14} />
      <span itemProp="addressLocality">
        Красноярск, ул. Красной Армии, 10с3, 660017
      </span>
    </button>
  )
}
export default MapLink
