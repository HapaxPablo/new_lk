'use client'

import { MapPin, Navigation } from 'lucide-react'
import { useModal } from '@/providers/modal/ModalProvider'
import styles from './LocationPermissionModal.module.scss'

interface Props {
  onEnable: () => void
}

export function LocationPermissionModal({ onEnable }: Props) {
  const { closeModal } = useModal('location_permission')

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
        <button
          onClick={() => {
            onEnable()
            closeModal()
          }}
          className={styles.primaryButton}
        >
          Разрешить
        </button>

        <button onClick={() => closeModal()} className={styles.secondaryButton}>
          Не сейчас
        </button>
      </div>
    </div>
  )
}
