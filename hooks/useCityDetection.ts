// hooks/useCityDetection.ts
import { useState, useCallback } from 'react'
import {
  geocodeByLatLng,
  fetchPopularCities,
  type PopularCity,
} from '@/lib/api/geocoding'
import { useGeoStore } from '@/store/geoStore'

export interface City {
  name: string
  region?: string
  country?: string
}

export function useCityDetection() {
  const [detectedCity, setDetectedCity] = useState<City | null>(null)
  const [citiesList, setCitiesList] = useState<PopularCity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCities = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const cities = await fetchPopularCities()
      setCitiesList(cities)
    } catch (err) {
      console.error('Cities loading error:', err)
      setError('Не удалось загрузить список городов')
    } finally {
      setLoading(false)
    }
  }, [])

  const detectCity = useCallback(
    async (latitude: number, longitude: number) => {
      setLoading(true)
      setError(null)

      try {
        // Определяем город по координатам
        const city = await geocodeByLatLng(latitude, longitude)
        setDetectedCity(city)

        // Загружаем список популярных городов для выбора
        const cities = await fetchPopularCities()
        setCitiesList(cities)
      } catch (err) {
        console.error('Detection error:', err)
        setError('Не удалось определить город')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const confirmCity = useCallback((city: City) => {
    // Сохраняем в Zustand store (он сам сохранит в localStorage)
    const { setSelectedCity } = useGeoStore.getState()
    setSelectedCity(city)
    // Создаём событие для обновления других компонентов
    window.dispatchEvent(new CustomEvent('cityChanged', { detail: city }))
  }, [])

  const selectCity = useCallback(
    (popularCity: PopularCity) => {
      const city: City = { name: popularCity.name }
      confirmCity(city)
    },
    [confirmCity]
  )

  return {
    detectedCity,
    citiesList,
    loading,
    error,
    loadCities,
    detectCity,
    confirmCity,
    selectCity,
  }
}
