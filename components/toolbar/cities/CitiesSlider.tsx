// components/toolbar/cities/CitiesSlider.tsx
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type City = {
    name: string | null
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

export default function CitiesSlider({ name }: City) {
    const [cities, setCities] = useState<ICity[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const sliderRef = useRef<HTMLDivElement>(null)

    const loadCities = useCallback(async (cityName: string) => {
        setLoading(true)
        setError(null)
        setCities([]) // Очищаем предыдущие результаты

        try {
            const params = new URLSearchParams()
            params.set('search', cityName)

            const response = await fetch(`/api/cities/?${params.toString()}`)

            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status}`)
            }

            const data = await response.json()

            const citiesData = Array.isArray(data)
                ? data
                : (data.results || data || [])

            setCities(citiesData)
            console.log('Загруженные города:', citiesData)

        } catch (error: any) {
            console.error('Ошибка загрузки городов:', error)
            setError(error.message || 'Не удалось загрузить города')
            setCities([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (name) {
            loadCities(name)
        } else {
            setCities([])
            setError(null)
            setLoading(false)
        }
    }, [name, loadCities])

    const scroll = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const scrollAmount = 200
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
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
        return (
            <div className="text-red-500 text-sm px-4">
                {error}
            </div>
        )
    }

    // Если города загружены, но список пуст
    if (cities.length === 0) {
        return (
            <div className="text-gray-400 text-sm px-4">
                Ничего не найдено
            </div>
        )
    }

    // Основной контент
    return (
        <div className="relative flex items-center flex-1 ml-4">
            {/* Кнопка скролла влево */}
            {cities.length > 15 && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 z-10 p-1 bg-white shadow-md rounded-full hover:shadow-lg transition-shadow"
                >
                    <ChevronLeft size={20} />
                </button>
            )}

            {/* Слайдер с городами */}
            <div
                ref={sliderRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide px-6"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {cities.map((city) => (
                    <a
                        key={city.id}
                        href={`/places/${city.slug}`}
                        className="flex-shrink-0 px-4 py-1.5 text-blue-900! bg-mauve-100 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-200 rounded-full text-sm whitespace-nowrap transition-all"
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
            {cities.length > 15 && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 z-10 p-1 bg-white shadow-md rounded-full hover:shadow-lg transition-shadow"
                >
                    <ChevronRight size={20} />
                </button>
            )}
        </div>
    )
}