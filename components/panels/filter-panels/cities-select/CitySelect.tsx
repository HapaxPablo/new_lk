'use client'

import {
    useState,
    useEffect,
    useCallback,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import styles from './CitySelect.module.scss'
import { useClickOutside } from '@/hooks/useClickOutside'

interface ICity {
    id: string
    name: string
    region: string
    locality_type: string
    timezone: string | null
    slug: string
    nomenclature_count: number
}

interface CitySelectProps {
    value: string
    onChange: (cityName: string) => void
    placeholder?: string
    disabled?: boolean
}

export const CitySelect = forwardRef(
    (
        {
            value,
            onChange,
            placeholder = 'Выберите город',
            disabled = false,
        }: CitySelectProps,
        ref
    ) => {
        const router = useRouter()
        const [cities, setCities] = useState<ICity[]>([])
        const [searchTerm, setSearchTerm] = useState('')
        const [loading, setLoading] = useState(false)
        const [isOpen, setIsOpen] = useState(false)
        const [selectedCity, setSelectedCity] = useState<ICity | null>(null)
        const [error, setError] = useState<string | null>(null)
        const [offset, setOffset] = useState(0)
        const [hasMore, setHasMore] = useState(true)
        const [loadingMore, setLoadingMore] = useState(false)

        const dropdownRef = useRef<HTMLDivElement>(null)
        const optionsContainerRef = useRef<HTMLDivElement>(null)
        const debouncedSearchTerm = useDebounce(searchTerm, 500)

        useClickOutside(
            [dropdownRef],
            () => {
                setIsOpen(false)
            },
            isOpen,
            true
        )

        const loadCities = useCallback(async (search: string = '') => {
            setLoading(true)
            setError(null)

            try {
                const params = new URLSearchParams()

                if (search) {
                    params.set('search', search)
                }

                const response = await fetch(`/api/cities/?${params.toString()}`)

                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.status}`)
                }

                const data = await response.json()

                // Универсальная обработка ответа
                const citiesData = Array.isArray(data)
                    ? data
                    : (data.results || data || [])

                setCities(citiesData)
                setHasMore(false) // Без пагинации

            } catch (error: any) {
                console.error('Ошибка загрузки городов:', error)
                setError(error.message || 'Не удалось загрузить города')
                setCities([])
            } finally {
                setLoading(false)
            }
        }, [])

        useEffect(() => {
            if (value) {
                // Если значение пришло извне, просто устанавливаем его
                setSelectedCity({ name: value } as ICity)
            } else {
                setSelectedCity(null)
            }
        }, [value])

        useEffect(() => {
            if (!isOpen || cities.length > 0) return
            loadCities('')
        }, [isOpen])

        useEffect(() => {
            if (!isOpen) return
            loadCities(debouncedSearchTerm)
        }, [debouncedSearchTerm, isOpen])

        // Загрузка при скролле
        const handleScroll = useCallback(() => {
            if (!optionsContainerRef.current || loadingMore || !hasMore) return

            const { scrollTop, scrollHeight, clientHeight } = optionsContainerRef.current
            if (scrollHeight - scrollTop - clientHeight < 100) {
                loadCities(searchTerm, false)
            }
        }, [loadingMore, hasMore, searchTerm, loadCities])

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value)
        }

        const handleSelect = (city: ICity) => {
            setSelectedCity(city)
            onChange(city.name)
            setIsOpen(false)

            // Редирект на /places/{slug}
            router.push(`/places/${city.slug}`)
        }

        const handleInputFocus = () => {
            setIsOpen(true)

            if (cities.length === 0 && !loading) {
                loadCities('')
            }
        }

        const handleRetry = () => {
            setError(null)
            loadCities(searchTerm)
        }

        const handleClear = () => {
            setSearchTerm('')
            setSelectedCity(null)
            onChange('')
            setError(null)

            if (isOpen) {
                loadCities('')
            }
        }

        const handleClearAll = () => {
            setSelectedCity(null)
            setSearchTerm('')
            onChange('')
        }

        useImperativeHandle(ref, () => ({
            handleClearAll,
        }))

        const placeholderText = selectedCity ? selectedCity.name : placeholder

        return (
            <div className={styles.citySelect} ref={dropdownRef}>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        placeholder={placeholderText}
                        disabled={disabled}
                        className={styles.input}
                    />

                    {searchTerm && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className={styles.clearButton}
                        >
                            ×
                        </button>
                    )}

                    {loading && (
                        <div className={styles.loader}>
                            <div className={styles.spinner}></div>
                        </div>
                    )}
                </div>

                {error && !isOpen && (
                    <div className={styles.error}>
                        <div className={styles.errorMessage}>{error}</div>
                        <button onClick={handleRetry} className={styles.retryButton}>
                            Повторить
                        </button>
                    </div>
                )}

                {isOpen && (
                    <div className={styles.dropdown}>
                        {loading ? (
                            <div className={styles.loading}>
                                <div className={styles.loadingSpinner}></div>
                                {searchTerm
                                    ? `Поиск городов "${searchTerm}"...`
                                    : 'Загрузка городов...'}
                            </div>
                        ) : error ? (
                            <div className={styles.errorState}>
                                <div>Не удалось загрузить города</div>
                                <button
                                    onClick={handleRetry}
                                    className={styles.retryButtonSmall}
                                >
                                    Попробовать снова
                                </button>
                            </div>
                        ) : cities.length === 0 ? (
                            <div className={styles.noResults}>
                                {searchTerm
                                    ? `Города по запросу "${searchTerm}" не найдены`
                                    : 'Нет доступных городов'}
                            </div>
                        ) : (
                            <div className={styles.options}>
                                <div className={styles.optionsHeader}>
                                    <div className={styles.headerInfo}>
                                        {searchTerm
                                            ? `Найдено: ${cities.length} по запросу "${searchTerm}"`
                                            : `Всего городов: ${cities.length}`}
                                        {selectedCity && ` • Выбран: ${selectedCity.name}`}
                                    </div>
                                    {selectedCity && (
                                        <div className={styles.headerActions}>
                                            <button
                                                type="button"
                                                onClick={handleClearAll}
                                                className={styles.clearAllButton}
                                            >
                                                Очистить
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className={styles.wrapper_option}
                                    ref={optionsContainerRef}
                                    onScroll={handleScroll}
                                >
                                    {cities.map((city) => {
                                        const isSelected = selectedCity?.id === city.id

                                        return (
                                            <div
                                                key={city.id}
                                                className={`${styles.option} ${isSelected ? styles.selected : ''}`}
                                                onClick={() => handleSelect(city)}
                                            >
                                                <div className={styles.cityInfo}>
                                                    <div className={styles.cityName}>
                                                        {city.name}
                                                    </div>
                                                    <div className='text-xs text-gray-400'>{city.nomenclature_count && `(${city.nomenclature_count})`}</div>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {loadingMore && (
                                        <div className={styles.loadingMore}>
                                            <div className={styles.loadingSpinner}></div>
                                            Загрузка...
                                        </div>
                                    )}

                                    {!hasMore && cities.length > 0 && (
                                        <div className={styles.endOfList}>
                                            Все города загружены
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }
)

CitySelect.displayName = 'CitySelect'