// components/GeolocationClient.tsx
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useCityDetection, type City } from '@/hooks/useCityDetection'
import { type PopularCity } from '@/lib/api/geocoding'
import { ModalWrapper } from '@/components/modal/ModalWrapper'
import { useModal } from '@/providers/modal/ModalProvider'
import { LocationPermissionModal } from './LocationPermissionModal'
import { CityConfirmationModal } from './CityConfirmationModal'
import { CityDisplay } from './CityDisplay'
import { useGeoStore } from '@/store/geoStore'

export default function GeolocationClient() {
  const permissionModal = useModal('location_permission')
  const cityModal = useModal('city_confirmation')
  const [isClient, setIsClient] = useState(false)

  // Флаги для предотвращения повторных действий
  const locationCheckStarted = useRef(false)
  const cityDetectionStarted = useRef(false)
  const permissionListenerSet = useRef(false)

  const {
    selectedCity,
    isInitialized,
    isGeolocationPromptDismissed,
    setSelectedCity,
    setInitialized,
    setDetectedCity,
    clearCity,
    dismissGeolocationPrompt,
  } = useGeoStore()

  const {
    coordinates,
    loading: geoLoading,
    permissionDenied,
    getLocation,
  } = useGeolocation()

  const {
    citiesList,
    loading: cityLoading,
    detectedCity: hookDetectedCity,
    loadCities,
    detectCity,
    confirmCity,
    selectCity,
  } = useCityDetection()

  // Инициализация на клиенте - ТОЛЬКО ОДИН РАЗ
  useEffect(() => {
    setIsClient(true)

    // Проверяем, есть ли уже сохраненный город в store
    const savedCity = useGeoStore.getState().selectedCity
    if (savedCity) {
      setInitialized(true)
      locationCheckStarted.current = true // Не нужно запрашивать геолокацию
    }
  }, []) // Пустой массив - только при монтировании

  // Слушаем событие изменения города
  useEffect(() => {
    const handleCityChange = (event: CustomEvent<City>) => {
      setSelectedCity(event.detail)
    }

    window.addEventListener('cityChanged', handleCityChange as EventListener)
    return () => {
      window.removeEventListener(
        'cityChanged',
        handleCityChange as EventListener
      )
    }
  }, [setSelectedCity])

  // Слушаем событие открытия селектора города
  useEffect(() => {
    const handleOpenSelector = () => {
      cityModal.openModal()
    }

    window.addEventListener('openCitySelector', handleOpenSelector)
    return () => {
      window.removeEventListener('openCitySelector', handleOpenSelector)
    }
  }, [cityModal])

  // Проверяем геопозицию - ТОЛЬКО ОДИН РАЗ
  useEffect(() => {
    if (
      !isClient ||
      isInitialized ||
      isGeolocationPromptDismissed ||
      locationCheckStarted.current
    ) {
      return
    }

    locationCheckStarted.current = true

    const checkLocation = async () => {
      const permissionState = await getGeolocationPermission()

      if (permissionState === 'granted') {
        getLocation()
      } else if (permissionState === 'denied') {
        dismissGeolocationPrompt()
      } else {
        permissionModal.openModal()
      }
    }

    checkLocation()
  }, [isClient, isInitialized, isGeolocationPromptDismissed]) // Убраны getLocation и permissionModal

  // Запоминаем отказ, полученный из системного окна браузера.
  useEffect(() => {
    if (permissionDenied) {
      dismissGeolocationPrompt()
      permissionModal.closeModal()
    }
  }, [permissionDenied]) // Обрабатываем изменение статуса отказа один раз

  // Когда получили координаты, определяем город - ТОЛЬКО ОДИН РАЗ
  useEffect(() => {
    if (!coordinates || cityDetectionStarted.current || isInitialized) {
      return
    }

    cityDetectionStarted.current = true

    detectCity(coordinates.latitude, coordinates.longitude)
  }, [coordinates, isInitialized]) // Убран detectCity из зависимостей

  // Синхронизируем detectedCity с Zustand store
  useEffect(() => {
    if (hookDetectedCity && !useGeoStore.getState().detectedCity) {
      setDetectedCity(hookDetectedCity)
    }
  }, [hookDetectedCity, setDetectedCity])

  // Слушаем изменения разрешения геолокации - ТОЛЬКО ОДИН РАЗ
  useEffect(() => {
    if (
      !navigator.permissions ||
      permissionListenerSet.current ||
      isInitialized
    ) {
      return
    }

    permissionListenerSet.current = true

    navigator.permissions
      .query({ name: 'geolocation' as PermissionName })
      .then((status) => {
        if (status.state === 'granted' && !locationCheckStarted.current) {
          locationCheckStarted.current = true
          getLocation()
        }

        status.onchange = () => {
          if (status.state === 'granted' && !locationCheckStarted.current) {
            locationCheckStarted.current = true
            getLocation()
          }
        }
      })
      .catch((err) => console.error('Permission query error:', err))
  }, [isInitialized]) // Пустой массив для однократного выполнения

  // Когда город определён, показываем модалку подтверждения
  useEffect(() => {
    if (
      hookDetectedCity &&
      !cityLoading &&
      !isInitialized &&
      hookDetectedCity.name &&
      !cityModal.isOpen
    ) {
      // Небольшая задержка чтобы избежать конфликтов
      setTimeout(() => {
        cityModal.openModal()
      }, 100)
    }
  }, [hookDetectedCity, cityLoading, isInitialized, cityModal])

  const handlePermissionGranted = useCallback(() => {
    permissionModal.closeModal()

    getLocation()
  }, [permissionModal, getLocation])

  const handlePermissionDismissed = useCallback(() => {
    dismissGeolocationPrompt()
    permissionModal.closeModal()
  }, [dismissGeolocationPrompt, permissionModal])

  const handleCityConfirm = useCallback(
    (isCorrect: boolean) => {
      if (isCorrect && hookDetectedCity && hookDetectedCity.name) {
        confirmCity(hookDetectedCity)
      }
      cityModal.closeModal()
    },
    [confirmCity, cityModal, hookDetectedCity]
  )

  const handleCitySelect = useCallback(
    (city: PopularCity) => {
      selectCity(city)
      cityModal.closeModal()
    },
    [selectCity, cityModal]
  )

  const handleCityChange = useCallback(() => {
    clearCity()
    locationCheckStarted.current = false
    cityDetectionStarted.current = false
    permissionListenerSet.current = false
    cityModal.openModal()
    void loadCities()
  }, [clearCity, cityModal, loadCities])

  if (!isClient) return null

  return (
    <>
      <CityDisplay
        selectedCity={selectedCity?.name || null}
        onCityChange={handleCityChange}
        isLoading={geoLoading || cityLoading}
      />

      <ModalWrapper
        id="location_permission"
        title="Разрешить геолокацию"
        onClose={handlePermissionDismissed}
      >
        <LocationPermissionModal
          onEnable={handlePermissionGranted}
          onDismiss={handlePermissionDismissed}
        />
      </ModalWrapper>

      <ModalWrapper id="city_confirmation" title="Подтверждение города">
        <CityConfirmationModal
          detectedCity={hookDetectedCity}
          citiesList={citiesList}
          loading={cityLoading}
          onConfirm={handleCityConfirm}
          onSelectCity={handleCitySelect}
        />
      </ModalWrapper>
    </>
  )
}

async function getGeolocationPermission(): Promise<PermissionState | 'prompt'> {
  if (!navigator.permissions) return 'prompt'

  try {
    const result = await navigator.permissions.query({
      name: 'geolocation' as PermissionName,
    })
    return result.state
  } catch {
    return 'prompt'
  }
}
