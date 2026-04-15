import { useState, useCallback } from 'react'

interface Coordinates {
  latitude: number
  longitude: number
  accuracy?: number
}

export function useGeolocation() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается вашим браузером')
      return
    }

    console.log('=== GEO REQUEST START ===')
    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(
          'SUCCESS coords:',
          position.coords.latitude,
          position.coords.longitude
        )
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
        setLoading(false)
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
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 300000,
      }
    )
    console.log('GEO requested, timeout 8s')
  }, [])

  return {
    coordinates,
    loading,
    error,
    getLocation,
  }
}
