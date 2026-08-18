'use client'

import {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import {
    getFilterOptions,
    useCachedFilterOptions,
} from '@/hooks/data/useCachedFilterOptions'
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
  onChange: (citySlug: string) => void
  placeholder?: string
  disabled?: boolean
  redirectOnSelect?: boolean
}

export const CitySelect = forwardRef(
    (
        {
            value,
            onChange,
            placeholder = 'Выберите город',
            disabled = false,
            redirectOnSelect = true,
        }: CitySelectProps,
        ref
    ) => {
        const router = useRouter()
        const [searchTerm, setSearchTerm] = useState('')
        const [isOpen, setIsOpen] = useState(false)
        const [selectedCity, setSelectedCity] = useState<ICity | null>(null)

        const dropdownRef = useRef<HTMLDivElement>(null)
        const debouncedSearchTerm = useDebounce(searchTerm, 500)
        const params = new URLSearchParams()
        if (debouncedSearchTerm) params.set('search', debouncedSearchTerm)
        const { data, error, isLoading: loading, mutate } =
            useCachedFilterOptions<ICity>(
                isOpen ? `/api/cities/?${params.toString()}` : null
            )
        const cities = getFilterOptions(data)

        useClickOutside(
            [dropdownRef],
            () => {
                setIsOpen(false)
            },
            isOpen,
            true
        )

        useEffect(() => {
            if (value) {
                // Если значение пришло извне, просто устанавливаем его
                setSelectedCity({ name: value } as ICity)
            } else {
                setSelectedCity(null)
            }
        }, [value])

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value)
        }

        const handleSelect = (city: ICity) => {
            setSelectedCity(city)
            onChange(city.slug)
            setIsOpen(false)

            if (redirectOnSelect) {
                router.push(`/places/${city.slug}`)
            }
        }

        const handleInputFocus = () => {
            setIsOpen(true)
        }

        const handleRetry = () => {
            void mutate()
        }

        const handleClear = () => {
            setSearchTerm('')
            setSelectedCity(null)
            onChange('')
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
                                <div className={styles.wrapper_option}>
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
