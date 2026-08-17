'use client'

import { MapPin } from 'lucide-react'
import styles from './LocationPermissionModal.module.scss'

interface Props {
  onEnable: () => void
  onDismiss: () => void
}

export function LocationPermissionModal({ onEnable, onDismiss }: Props) {
  return (
    <div className={styles.content}>
      <div className={styles.iconContainer}>
        <MapPin className={styles.icon} size={24} />
      </div>

      <h3 className={styles.title}>Определение города</h3>

      <p className={styles.description}>
        Для автоматического определения вашего города необходимо разрешить
        доступ к геолокации
      </p>

      <div className={styles.buttonsContainer}>
        <button onClick={onEnable} className={styles.primaryButton}>
          Разрешить
        </button>

        <button onClick={onDismiss} className={styles.secondaryButton}>
          Не сейчас
        </button>
      </div>
    </div>
  )
}
