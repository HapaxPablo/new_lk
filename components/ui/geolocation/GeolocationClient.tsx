'use client'

import { useEffect, useState } from 'react'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useCityDetection } from '@/hooks/useCityDetection'
import { ModalWrapper } from '@/components/modal/ModalWrapper'
import { useModal } from '@/providers/modal/ModalProvider'
import { LocationPermissionModal } from './LocationPermissionModal'
import { CityConfirmationModal } from './CityConfirmationModal'
import { CityDisplay } from './CityDisplay'

export default function GeolocationClient() {
  const permissionModal = useModal('location_permission')
  const cityModal = useModal('city_confirmation')
  const [isClient, setIsClient] = useState(false)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const {
    coordinates,
    loading: geoLoading,
    error: geoError,
    getLocation,
  } = useGeolocation()

  const {
    detectedCity,
    citiesList,
    loading: cityLoading,
    detectCity,
    confirmCity,
    selectCity,
  } = useCityDetection()

  // Загружаем сохранённый город при загрузке
  useEffect(() => {
    setIsClient(true)

    const loadSavedCity = () => {
      const savedCity = localStorage.getItem('selectedCity')
      console.log('Saved city from localStorage:', savedCity)

      if (savedCity) {
        try {
          const city = JSON.parse(savedCity)
          setSelectedCity(city.name)
          setIsInitialized(true)
          console.log('City loaded:', city.name)
        } catch (e) {
          console.error('Error parsing saved city', e)
          setIsInitialized(false)
        }
      } else {
        console.log('No saved city found')
        setIsInitialized(false)
      }
    }

    loadSavedCity()
  }, [])

  // Слушаем событие изменения города
  useEffect(() => {
    const handleCityChange = (event: CustomEvent) => {
      console.log('City changed event:', event.detail)
      setSelectedCity(event.detail.name)
      setIsInitialized(true)
    }

    window.addEventListener('cityChanged', handleCityChange as EventListener)

    return () => {
      window.removeEventListener(
        'cityChanged',
        handleCityChange as EventListener
      )
    }
  }, [])

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
  }, [])

  // Проверяем геопозицию только если город не выбран
  useEffect(() => {
    if (!isClient || isInitialized) {
      console.log('Skipping location check - already initialized or not client')
      return
    }

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
  }, [isClient, isInitialized, getLocation])

  // Когда получили координаты, определяем город - ФИКС
  useEffect(() => {
    console.log('*** COORDS EFFECT ***', {
      hasCoords: !!coordinates,
      detectedCity: !!detectedCity,
      cityLoading,
      isInitialized,
    })

    if (coordinates && !detectedCity && !cityLoading && !isInitialized) {
      console.log(
        '🚀 CALLING detectCity:',
        coordinates.latitude.toFixed(2),
        coordinates.longitude.toFixed(2)
      )
      detectCity(coordinates.latitude, coordinates.longitude)
    }
  }, [coordinates, detectedCity, cityLoading, detectCity, isInitialized])

  // Слушаем изменения разрешения геолокации
  useEffect(() => {
    if (!navigator.permissions || selectedCity || isInitialized) return

    navigator.permissions
      .query({ name: 'geolocation' as PermissionName })
      .then((permissionStatus) => {
        console.log('Permission status:', permissionStatus.state)
        if (permissionStatus.state === 'granted') {
          getLocation()
        }
        permissionStatus.onchange = () => {
          console.log('Permission changed:', permissionStatus.state)
          if (permissionStatus.state === 'granted') {
            getLocation()
          }
        }
      })
      .catch((err) => console.error('Permission query error:', err))
  }, [getLocation, selectedCity, isInitialized])

  // Когда город определён, показываем модалку подтверждения
  useEffect(() => {
    console.log('Modal check:', {
      detectedCity,
      cityLoading,
      isInitialized,
      cityModalIsOpen: cityModal.isOpen,
    })

    if (detectedCity && !cityLoading && !isInitialized && detectedCity.name) {
      console.log('🎉 SHOWING CITY MODAL:', detectedCity.name)
      cityModal.openModal()
    }
  }, [detectedCity, cityLoading, isInitialized])

  const handlePermissionGranted = () => {
    console.log('Permission granted')
    permissionModal.closeModal()
    getLocation()
  }

  const handleCityConfirm = (isCorrect: boolean) => {
    console.log('City confirmed:', isCorrect, detectedCity)

    if (isCorrect && detectedCity && detectedCity.name) {
      confirmCity(detectedCity)
      setSelectedCity(detectedCity.name)
      setIsInitialized(true)
    } else if (!isCorrect) {
      console.log('User said no, showing city selector')
    }
    cityModal.closeModal()
  }

  const handleCitySelect = (city: string) => {
    console.log('City selected:', city)
    selectCity(city)
    setSelectedCity(city)
    setIsInitialized(true)
    cityModal.closeModal()
  }

  const handleCityChange = () => {
    console.log('Changing city')
    localStorage.removeItem('selectedCity')
    setSelectedCity(null)
    setIsInitialized(false)
    cityModal.openModal()
  }

  // Не рендерим на сервере
  if (!isClient) return null

  return (
    <>
      <CityDisplay
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        isLoading={geoLoading || cityLoading}
      />

      <ModalWrapper id="location_permission" title="Разрешить геолокацию">
        <LocationPermissionModal onEnable={handlePermissionGranted} />
      </ModalWrapper>

      <ModalWrapper id="city_confirmation" title="Подтверждение города">
        <CityConfirmationModal
          detectedCity={detectedCity}
          citiesList={citiesList}
          loading={cityLoading}
          onConfirm={handleCityConfirm}
          onSelectCity={handleCitySelect}
        />
      </ModalWrapper>
    </>
  )
}

// Вспомогательная функция проверки разрешения
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
