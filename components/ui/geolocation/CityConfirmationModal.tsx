'use client'

import { useState, useEffect } from 'react'
import { City } from '@/hooks/useCityDetection'
import { type PopularCity } from '@/lib/api/geocoding'
import { useModal } from '@/providers/modal/ModalProvider'
import styles from './CityConfirmationModal.module.scss'

interface Props {
  detectedCity: City | null
  citiesList: PopularCity[]
  loading: boolean
  onConfirm: (isCorrect: boolean) => void
  onSelectCity: (city: PopularCity) => void
}

export function CityConfirmationModal({
  detectedCity,
  citiesList,
  loading,
  onConfirm,
  onSelectCity,
}: Props) {
  const [showCitySelector, setShowCitySelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCities, setFilteredCities] = useState<PopularCity[]>(citiesList)

  const { closeModal } = useModal('city_confirmation')

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredCities(citiesList)
    } else {
      setFilteredCities(
        citiesList.filter((city) =>
          city.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }
  }, [searchQuery, citiesList])

  // ModalWrapper handles visibility

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <span className="text-gray-700">Определяем ваш город...</span>
      </div>
    )
  }

  // Without coordinates, skip confirmation and offer manual city selection.
  if (showCitySelector || !detectedCity) {
    return (
      <div className={styles.selectorContainer}>
        <h3 className={styles.title}>Выберите ваш город</h3>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="Поиск города..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />

        <div className={styles.cityList}>
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  onSelectCity(city)
                  closeModal()
                }}
                className={styles.cityItem}
              >
                {city.name}
              </button>
            ))
          ) : (
            <div className={styles.emptyState}>Город не найден</div>
          )}
        </div>

        <button
          onClick={() => setShowCitySelector(false)}
          className={styles.backButton}
        >
          Назад
        </button>
      </div>
    )
  }

  return (
    <>
      <h3 className={styles.title}>Подтверждение города</h3>

      <p className="mt-4 text-gray-700">
        Ваш город{' '}
        <span className={styles.cityName}>{detectedCity?.name || '...'}</span>?
      </p>

      {detectedCity?.region && (
        <p className={styles.subtitle}>
          {detectedCity.region}, {detectedCity.country}
        </p>
      )}

      <div className={styles.buttonsContainer}>
        <button
          onClick={() => {
            onConfirm(true)
            closeModal()
          }}
          className={styles.primaryButton}
        >
          Да
        </button>

        <button
          onClick={() => setShowCitySelector(true)}
          className={styles.secondaryButton}
        >
          Нет
        </button>
      </div>
    </>
  )
}
