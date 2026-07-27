// components/GeolocationClient.tsx
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useCityDetection, type City } from '@/hooks/useCityDetection'
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
    setSelectedCity,
    setInitialized,
    setDetectedCity,
    clearCity,
  } = useGeoStore()

  const {
    coordinates,
    loading: geoLoading,
    getLocation,
  } = useGeolocation()

  const {
    citiesList,
    loading: cityLoading,
    detectedCity: hookDetectedCity,
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
      console.log('City loaded from store:', savedCity.name)
      setInitialized(true)
      locationCheckStarted.current = true // Не нужно запрашивать геолокацию
    }
  }, []) // Пустой массив - только при монтировании

  // Слушаем событие изменения города
  useEffect(() => {
    const handleCityChange = (event: CustomEvent<City>) => {
      console.log('City changed event:', event.detail)
      setSelectedCity(event.detail)
    }

    window.addEventListener('cityChanged', handleCityChange as EventListener)
    return () => {
      window.removeEventListener('cityChanged', handleCityChange as EventListener)
    }
  }, [setSelectedCity])

  // Слушаем событие открытия селектора города
  useEffect(() => {
    const handleOpenSelector = () => {
      console.log('Opening city selector')
      cityModal.openModal()
    }

    window.addEventListener('openCitySelector', handleOpenSelector)
    return () => {
      window.removeEventListener('openCitySelector', handleOpenSelector)
    }
  }, [cityModal])

  // Проверяем геопозицию - ТОЛЬКО ОДИН РАЗ
  useEffect(() => {
    if (!isClient || isInitialized || locationCheckStarted.current) {
      return
    }

    locationCheckStarted.current = true

    const checkLocation = async () => {
      console.log('Checking location, no city selected')
      const hasPermission = await checkGeolocationPermission()
      console.log('Has permission:', hasPermission)

      if (hasPermission) {
        getLocation()
      } else {
        permissionModal.openModal()
      }
    }

    checkLocation()
  }, [isClient, isInitialized]) // Убраны getLocation и permissionModal

  // Когда получили координаты, определяем город - ТОЛЬКО ОДИН РАЗ
  useEffect(() => {
    if (!coordinates || cityDetectionStarted.current || isInitialized) {
      return
    }

    cityDetectionStarted.current = true

    console.log(
      '🚀 CALLING detectCity:',
      coordinates.latitude.toFixed(2),
      coordinates.longitude.toFixed(2)
    )
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
    if (!navigator.permissions || permissionListenerSet.current || isInitialized) {
      return
    }

    permissionListenerSet.current = true

    navigator.permissions
      .query({ name: 'geolocation' as PermissionName })
      .then((status) => {
        console.log('Permission status:', status.state)

        if (status.state === 'granted' && !locationCheckStarted.current) {
          locationCheckStarted.current = true
          getLocation()
        }

        status.onchange = () => {
          console.log('Permission changed:', status.state)
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
      console.log('🎉 SHOWING CITY MODAL:', hookDetectedCity.name)
      // Небольшая задержка чтобы избежать конфликтов
      setTimeout(() => {
        cityModal.openModal()
      }, 100)
    }
  }, [hookDetectedCity, cityLoading, isInitialized, cityModal])

  const handlePermissionGranted = useCallback(() => {
    console.log('Permission granted')
    permissionModal.closeModal()

    getLocation()
  }, [permissionModal, getLocation])

  const handleCityConfirm = useCallback((isCorrect: boolean) => {
    console.log('City confirmed:', isCorrect, hookDetectedCity)

    if (isCorrect && hookDetectedCity && hookDetectedCity.name) {
      confirmCity(hookDetectedCity)
    }
    cityModal.closeModal()
  }, [confirmCity, cityModal, hookDetectedCity])

  const handleCitySelect = useCallback((cityName: string) => {
    console.log('City selected:', cityName)
    selectCity(cityName)
    cityModal.closeModal()
  }, [selectCity, cityModal])

  const handleCityChange = useCallback(() => {
    console.log('Changing city')
    clearCity()
    locationCheckStarted.current = false
    cityDetectionStarted.current = false
    permissionListenerSet.current = false
    cityModal.openModal()
  }, [clearCity, cityModal])

  if (!isClient) return null

  return (
    <>
      <CityDisplay
        selectedCity={selectedCity?.name || null}
        onCityChange={handleCityChange}
        isLoading={geoLoading || cityLoading}
      />

      <ModalWrapper id="location_permission" title="Разрешить геолокацию">
        <LocationPermissionModal onEnable={handlePermissionGranted} />
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

async function checkGeolocationPermission(): Promise<boolean> {
  if (!navigator.permissions) return false

  try {
    const result = await navigator.permissions.query({
      name: 'geolocation' as PermissionName,
    })
    return result.state === 'granted'
  } catch {
    return false
  }
}