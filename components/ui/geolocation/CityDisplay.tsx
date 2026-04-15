'use client'
import styles from './/GeoStyles.module.scss'
import { Navigation } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface CityDisplayProps {
  selectedCity: string | null
  onCityChange: () => void
  isLoading?: boolean
}

export function CityDisplay({
  selectedCity,
  onCityChange,
  isLoading,
}: CityDisplayProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  console.log('CityDisplay render:', { selectedCity, isLoading })

  // Закрываем дропдаун при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (isLoading) {
    return (
      <div className={styles.cityDisplay}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <span className="text-sm text-gray-600">Определение...</span>
        </div>
      </div>
    )
  }

  if (!selectedCity) {
    return (
      <div className={styles.cityDisplay}>
        <button
          onClick={() => {
            console.log('City button clicked - no city selected')
            onCityChange()
          }}
          className={styles.cityButton}
        >
          <Navigation className={styles.geoIcon} />
          <span className={styles.cityButtonText}>Выбрать город</span>
        </button>
      </div>
    )
  }

  return (
    <div className={styles.cityDisplay} ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles.cityButton}
        >
          <Navigation className={styles.geoIcon} />
          <span className={styles.citySelectedText}>{selectedCity}</span>
        </button>

        {/* Дропдаун меню */}
        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              <p className={styles.dropdownCurrentCityLabel}>Текущий город</p>
              <p className={styles.dropdownCurrentCity}>{selectedCity}</p>
            </div>
            <button
              onClick={() => {
                console.log('Change city clicked')
                onCityChange()
                setIsOpen(false)
              }}
              className={styles.dropdownChangeButton}
            >
              <Navigation className={styles.geoIcon} />
              <span>Изменить город</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
