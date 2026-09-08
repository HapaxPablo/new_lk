export interface City {
  name: string
  region?: string
  country?: string
}

export interface PopularCity {
  id: string
  name: string
  region: string
  locality_type: string
  timezone: string | null
  slug: string
  nomenclature_count: number
}

const FALLBACK_CITY_NAMES = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
]

interface NominatimResponse {
  address: {
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
    country_code?: string
  }
  display_name: string
  lat: string
  lon: string
}

// Обратное геокодирование через серверный прокси (обходит CSP/CORS)
export async function geocodeByLatLng(lat: number, lng: number): Promise<City> {
  const response = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`)

  if (!response.ok) {
    throw new Error('Ошибка геокодирования')
  }

  const data = await response.json()
  if (data.error) {
    throw new Error(data.error)
  }

  return data
}

// Получение списка популярных городов
export async function fetchPopularCities(): Promise<PopularCity[]> {
  try {
    const response = await fetch('/api/cities/popular/')

    if (!response.ok) {
      throw new Error(`Ошибка загрузки городов: ${response.status}`)
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Некорректный формат списка городов')
    }

    return data as PopularCity[]
  } catch (error) {
    console.error('Error fetching cities:', error)
    return FALLBACK_CITY_NAMES.map((name) => ({
      id: `fallback-${name}`,
      name,
      region: '',
      locality_type: '',
      timezone: null,
      slug: name,
      nomenclature_count: 0,
    }))
  }
}

// Прямое геокодирование (город -> координаты)
export async function geocodeByCityName(
  cityName: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1&accept-language=ru`,
      {
        headers: {
          'User-Agent': 'NewLK-App/1.0',
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      }
    }

    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}
