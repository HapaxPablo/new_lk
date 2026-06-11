// hooks/useGeolocation.ts
import { useState, useCallback, useRef } from 'react'
import { useGeoStore } from '@/store/geoStore'

interface Coordinates {
  latitude: number
  longitude: number
  accuracy?: number
}

export function useGeolocation() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestInProgress = useRef(false) // Флаг для предотвращения повторных запросов

  const getLocation = useCallback(() => {
    // Предотвращаем повторные запросы
    if (requestInProgress.current) {
      console.log('GEO request already in progress, skipping')
      return
    }

    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается вашим браузером')
      return
    }

    console.log('=== GEO REQUEST START ===')
    requestInProgress.current = true
    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(
          'SUCCESS coords:',
          position.coords.latitude,
          position.coords.longitude
        )

        const newCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }

        setCoordinates(newCoordinates)

        // Сохраняем координаты в Zustand store
        useGeoStore.getState().setCoordinates(newCoordinates)

        setLoading(false)
        requestInProgress.current = false
      },
      (err) => {
        console.error('GEO ERROR:', err.code, err.message)
        let errorMessage = 'Не удалось определить местоположение'

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Разрешите геолокацию'
            break
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Позиция недоступна'
            break
          case err.TIMEOUT:
            errorMessage = 'Timeout - повторите'
            break
        }

        setError(errorMessage)
        setLoading(false)
        requestInProgress.current = false
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 300000,
      }
    )
    console.log('GEO requested, timeout 8s')
  }, []) // Пустой массив зависимостей, так как используем ref

  return {
    coordinates,
    loading,
    error,
    getLocation,
  }
}
