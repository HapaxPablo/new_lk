'use client'

import { useEffect, useState } from 'react'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useCityDetection } from '@/hooks/useCityDetection'
import { LocationPermissionModal } from './LocationPermissionModal'
import { CityConfirmationModal } from './CityConfirmationModal'
import { CityDisplay } from './CityDisplay'

export default function GeolocationClient() {
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showCityModal, setShowCityModal] = useState(false)
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
      setShowCityModal(true)
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
        setShowPermissionModal(true)
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
      showCityModal,
    })

    if (detectedCity && !cityLoading && !isInitialized && detectedCity.name) {
      console.log('🎉 SHOWING CITY MODAL:', detectedCity.name)
      setShowCityModal(true)
    }
  }, [detectedCity, cityLoading, isInitialized])

  const handlePermissionGranted = () => {
    console.log('Permission granted')
    setShowPermissionModal(false)
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
    setShowCityModal(false)
  }

  const handleCitySelect = (city: string) => {
    console.log('City selected:', city)
    selectCity(city)
    setSelectedCity(city)
    setIsInitialized(true)
    setShowCityModal(false)
  }

  const handleCityChange = () => {
    console.log('Changing city')
    localStorage.removeItem('selectedCity')
    setSelectedCity(null)
    setIsInitialized(false)
    setShowCityModal(true)
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

      <LocationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onEnable={handlePermissionGranted}
      />

      <CityConfirmationModal
        isOpen={showCityModal}
        detectedCity={detectedCity}
        citiesList={citiesList}
        loading={cityLoading}
        onConfirm={handleCityConfirm}
        onSelectCity={handleCitySelect}
      />
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
