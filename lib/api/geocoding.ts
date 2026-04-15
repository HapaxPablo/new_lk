export interface City {
  name: string
  region?: string
  country?: string
}

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
export async function fetchPopularCities(): Promise<string[]> {
  // Можно получить из API или вернуть статический список
  try {
    // Опционально: можно загружать список из вашего API
    // const response = await fetch('/api/cities/popular');
    // const data = await response.json();
    // return data.cities;

    // Пока используем статический список популярных городов России
    return [
      'Москва',
      'Санкт-Петербург',
      'Новосибирск',
      'Екатеринбург',
      'Казань',
      'Нижний Новгород',
      'Красноярск',
      'Челябинск',
      'Самара',
      'Уфа',
      'Ростов-на-Дону',
      'Омск',
      'Краснодар',
      'Воронеж',
      'Пермь',
      'Волгоград',
      'Саратов',
      'Тюмень',
      'Тольятти',
      'Ижевск',
      'Барнаул',
      'Иркутск',
      'Хабаровск',
      'Ярославль',
      'Владивосток',
    ]
  } catch (error) {
    console.error('Error fetching cities:', error)
    // Возвращаем базовый список в случае ошибки
    return [
      'Москва',
      'Санкт-Петербург',
      'Новосибирск',
      'Екатеринбург',
      'Казань',
    ]
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
