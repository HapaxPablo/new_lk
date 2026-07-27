'use client'
import styles from './InfoMenu.module.scss'
import { Phone } from 'lucide-react'

const InfoMenu = () => {
  const handlePhoneClick = () => {
    window.location.href = 'tel:88002225938'
  }
  return (
    <div className={styles.phone_container}>
      <button
        onClick={handlePhoneClick}
        className={styles.phone}
        aria-label="Позвонить по номеру 8 800 222 59 38"
        title="Бесплатная горячая линия"
      >
        <span className={styles.phone__desktop} aria-hidden="false" aria-label='телефон'>
          8 800 222 59 38
        </span>
        <Phone className={styles.phone__mobile} size={24} aria-hidden="false" aria-label='телефон' />
      </button>
    </div>
  )
}
export default InfoMenu
