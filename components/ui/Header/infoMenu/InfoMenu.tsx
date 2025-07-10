'use client'
import styles from './InfoMenu.module.scss'
import { Phone } from 'lucide-react'

const InfoMenu = () => {
  const handlePhoneClick = () => {
    window.location.href = 'tel:88005005050'
  }
  return (
    <div className={styles.phone_container}>
      <button
        onClick={handlePhoneClick}
        className={styles.phone}
        aria-label="Позвонить по номеру 8 800 500 50 50"
        title="Бесплатная горячая линия"
      >
        <span className={styles.phone__desktop} aria-hidden="false">
          8 800 500 50 50
        </span>
        <Phone className={styles.phone__mobile} size={24} aria-hidden="true" />
      </button>
    </div>
  )
}
export default InfoMenu
