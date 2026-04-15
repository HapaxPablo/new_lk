import { useState, useCallback } from 'react';
import { geocodeByLatLng, fetchPopularCities } from '@/lib/api/geocoding';

export interface City {
  name: string;
  region?: string;
  country?: string;
}

export function useCityDetection() {
  const [detectedCity, setDetectedCity] = useState<City | null>(null);
  const [citiesList, setCitiesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectCity = useCallback(async (latitude: number, longitude: number) => {
    console.log('Detecting city for coordinates:', latitude, longitude);
    setLoading(true);
    setError(null);
    
    try {
      // Определяем город по координатам
      const city = await geocodeByLatLng(latitude, longitude);
      console.log('City detected:', city);
      setDetectedCity(city);
      
      // Загружаем список популярных городов для выбора
      const cities = await fetchPopularCities();
      console.log('Cities list loaded:', cities.length);
      setCitiesList(cities);
    } catch (err) {
      console.error('Detection error:', err);
      setError('Не удалось определить город');
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmCity = useCallback((city: City) => {
    console.log('Confirming city:', city);
    // Сохраняем город в localStorage
    localStorage.setItem('selectedCity', JSON.stringify(city));
    // Создаём событие для обновления других компонентов
    window.dispatchEvent(new CustomEvent('cityChanged', { detail: city }));
  }, []);

  const selectCity = useCallback((cityName: string) => {
    console.log('Selecting city:', cityName);
    const city: City = { name: cityName };
    confirmCity(city);
  }, [confirmCity]);

  return {
    detectedCity,
    citiesList,
    loading,
    error,
    detectCity,
    confirmCity,
    selectCity,
  };
}