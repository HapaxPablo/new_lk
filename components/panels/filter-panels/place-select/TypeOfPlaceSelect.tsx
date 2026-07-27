'use client'

import {
    useState,
    useEffect,
    useCallback,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { ITypeOfPlace } from '@/types/nomenclature'
import styles from './TypeOfPlaceSelect.module.scss'
import { useClickOutside } from '@/hooks/useClickOutside'

interface TypeOfPlaceSelectProps {
    value: string
    onChange: (placeTypeNames: string) => void
    placeholder?: string
    disabled?: boolean
}

export const TypeOfPlaceSelect = forwardRef(
    (
        {
            value,
            onChange,
            placeholder = 'Выберите типы мест',
            disabled = false,
        }: TypeOfPlaceSelectProps,
        ref
    ) => {
        const [placeTypes, setPlaceTypes] = useState<ITypeOfPlace[]>([])
        const [searchTerm, setSearchTerm] = useState('')
        const [loading, setLoading] = useState(false)
        const [isOpen, setIsOpen] = useState(true)
        const [selectedNames, setSelectedNames] = useState<string[]>([])
        const [error, setError] = useState<string | null>(null)

        const dropdownRef = useRef<HTMLDivElement>(null)
        const debouncedSearchTerm = useDebounce(searchTerm, 500)

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
                const names = value.split(',').filter((n) => n.trim() !== '')
                setSelectedNames(names)
            } else {
                setSelectedNames([])
            }
        }, [value])

        const loadPlaceTypes = useCallback(async (search: string = '') => {
            setLoading(true)
            setError(null)

            try {
                const params = new URLSearchParams()

                if (search) {
                    params.set('name', search)
                }

                params.set('limit', '150')
                params.set('page', '1')

                const response = await fetch(`/api/place?${params.toString()}`)

                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.status}`)
                }

                const data = await response.json()
                setPlaceTypes(data.results || data)
            } catch (error: any) {
                console.error('Ошибка загрузки типов мест:', error)
                setError(error.message || 'Не удалось загрузить типы мест')
                setPlaceTypes([])
            } finally {
                setLoading(false)
            }
        }, [])

        useEffect(() => {
            if (!isOpen || placeTypes.length > 0) return
            loadPlaceTypes('')
        }, [isOpen])

        useEffect(() => {
            if (!isOpen) return
            loadPlaceTypes(debouncedSearchTerm)
        }, [debouncedSearchTerm, isOpen])

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value)
        }

        const handleToggle = (placeType: ITypeOfPlace) => {
            const isSelected = selectedNames.includes(placeType.name)
            const newSelected = isSelected
                ? selectedNames.filter((n) => n !== placeType.name)
                : [...selectedNames, placeType.name]

            setSelectedNames(newSelected)
            onChange(newSelected.join(','))
        }

        const handleInputFocus = () => {
            setIsOpen(true)

            if (placeTypes.length === 0 && !loading) {
                loadPlaceTypes('')
            }
        }

        const handleRetry = () => {
            setError(null)
            loadPlaceTypes(searchTerm)
        }

        const handleClear = () => {
            setSearchTerm('')
            setSelectedNames([])
            onChange('')
            setError(null)

            if (isOpen) {
                loadPlaceTypes('')
            }
        }

        const handleSelectAll = () => {
            const allNames = placeTypes.map((pt) => pt.name)
            setSelectedNames(allNames)
            onChange(allNames.join(','))
        }

        const handleClearAll = () => {
            setSelectedNames([])
            setSearchTerm('')
            onChange('')
        }

        useImperativeHandle(ref, () => ({
            handleClearAll,
        }))

        const placeholderText =
            selectedNames.length > 0
                ? `Выбрано типов: ${selectedNames.length}`
                : placeholder

        return (
            <div className={styles.placeTypeSelect} ref={dropdownRef}>
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

                {error && (
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
                                    ? `Поиск типов мест "${searchTerm}"...`
                                    : 'Загрузка типов мест...'}
                            </div>
                        ) : error ? (
                            <div className={styles.errorState}>
                                <div>Не удалось загрузить типы мест</div>
                                <button
                                    onClick={handleRetry}
                                    className={styles.retryButtonSmall}
                                >
                                    Попробовать снова
                                </button>
                            </div>
                        ) : placeTypes.length === 0 ? (
                            <div className={styles.noResults}>
                                {searchTerm
                                    ? `Типы мест по запросу "${searchTerm}" не найдены`
                                    : 'Нет доступных типов мест'}
                            </div>
                        ) : (
                            <div className={styles.options}>
                                <div className={styles.optionsHeader}>
                                    <div className={styles.headerInfo}>
                                        {searchTerm
                                            ? `Найдено: ${placeTypes.length} по запросу "${searchTerm}"`
                                            : `Всего типов: ${placeTypes.length}`}
                                        {selectedNames.length > 0 &&
                                            ` • Выбрано: ${selectedNames.length}`}
                                    </div>
                                    <div className={styles.headerActions}>
                                        <button
                                            type="button"
                                            onClick={handleSelectAll}
                                            className={styles.selectAllButton}
                                        >
                                            Выбрать все
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleClearAll}
                                            className={styles.clearAllButton}
                                        >
                                            Очистить
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.wrapper_option}>
                                    {placeTypes.map((placeType) => {
                                        const isSelected = selectedNames.includes(placeType.name)

                                        return (
                                            <div
                                                key={placeType.id}
                                                className={`${styles.option} ${isSelected ? styles.selected : ''
                                                    }`}
                                                onClick={() => handleToggle(placeType)}
                                            >
                                                <div className={styles.checkbox}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        readOnly
                                                        className={styles.checkboxInput}
                                                    />
                                                    <span className={styles.checkboxCheckmark} />
                                                </div>

                                                <div className={styles.placeTypeInfo}>
                                                    <div className={styles.placeTypeName}>
                                                        {placeType.name}
                                                    </div>
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

TypeOfPlaceSelect.displayName = 'TypeOfPlaceSelect'