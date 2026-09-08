// components/toolbar/cities/CitiesSlider.tsx
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
type City = {
  name: string | null
  typeOfPlace?: string
}

interface ICity {
  id: string
  name: string
  region: string
  locality_type: string
  timezone: string | null
  slug: string
  nomenclature_count: number
}

export default function CitiesSlider({ name, typeOfPlace = '' }: City) {
  const [cities, setCities] = useState<ICity[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const updateScrollControls = useCallback(() => {
    const slider = sliderRef.current
    if (!slider) return

    const maxScrollLeft = slider.scrollWidth - slider.clientWidth
    setCanScrollLeft(slider.scrollLeft > 1)
    setCanScrollRight(slider.scrollLeft < maxScrollLeft - 1)
  }, [])

  const loadCities = useCallback(
    async (cityName: string) => {
      setLoading(true)
      setError(null)
      setCities([]) // Очищаем предыдущие результаты

      try {
        const params = new URLSearchParams()
        params.set('search', cityName)
        if (typeOfPlace) {
          params.set('type_of_place', typeOfPlace)
        }

        const response = await fetch(`/api/cities/?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`Ошибка загрузки: ${response.status}`)
        }

        const data = await response.json()

        const citiesData = Array.isArray(data)
          ? data
          : data.results || data || []

        setCities(citiesData)
      } catch (error: any) {
        console.error('Ошибка загрузки городов:', error)
        setError(error.message || 'Не удалось загрузить города')
        setCities([])
      } finally {
        setLoading(false)
      }
    },
    [typeOfPlace]
  )

  useEffect(() => {
    if (name) {
      loadCities(name)
    } else {
      setCities([])
      setError(null)
      setLoading(false)
    }
  }, [name, loadCities])

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    const resizeObserver = new ResizeObserver(updateScrollControls)
    resizeObserver.observe(slider)
    slider.addEventListener('scroll', updateScrollControls, { passive: true })
    updateScrollControls()

    return () => {
      resizeObserver.disconnect()
      slider.removeEventListener('scroll', updateScrollControls)
    }
  }, [cities, updateScrollControls])

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = Math.min(sliderRef.current.clientWidth * 0.8, 360)
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  // Условный рендер после всех хуков
  if (!name) {
    return null
  }

  // Показываем лоадер
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4">
        <div className="animate-pulse flex gap-2">
          <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-32 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-28 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    )
  }

  // Показываем ошибку
  if (error) {
    return <div className="text-red-500 text-sm px-4">{error}</div>
  }

  // Если города загружены, но список пуст
  if (cities.length === 0) {
    return <div className="text-gray-400 text-sm px-4">Ничего не найдено</div>
  }

  // Основной контент
  return (
    <div className="relative flex w-full min-w-0 items-center">
      {/* Кнопка скролла влево */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label="Прокрутить города влево"
          className="absolute left-0 z-10 hidden rounded-full bg-white p-1 shadow-md transition-shadow hover:shadow-lg md:flex"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Слайдер с городами */}
      <div
        ref={sliderRef}
        className={`flex w-full snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain touch-pan-x scrollbar-hide ${
          canScrollLeft ? 'pl-8' : ''
        } ${canScrollRight ? 'pr-8' : ''}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x',
        }}
      >
        {cities.map((city) => (
          <a
            key={city.id}
            href={`/places/${city.slug}`}
            className="flex-shrink-0 snap-start rounded-full border border-transparent bg-mauve-100 px-4 py-1.5 text-sm whitespace-nowrap text-blue-900! transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            title={`${city.name} (${city.nomenclature_count} объектов)`}
          >
            {city.name}
            {city.nomenclature_count > 0 && (
              <span className="ml-1.5 text-xs text-gray-500">
                {city.nomenclature_count}
              </span>
            )}
          </a>
        ))}
      </div>

      {/* Кнопка скролла вправо */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label="Прокрутить города вправо"
          className="absolute right-0 z-10 hidden rounded-full bg-white p-1 shadow-md transition-shadow hover:shadow-lg md:flex"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  )
}
