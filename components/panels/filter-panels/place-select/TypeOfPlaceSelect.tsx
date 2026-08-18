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
import {
    useCachedInfiniteFilterOptions,
} from '@/hooks/data/useCachedFilterOptions'

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
        const [searchTerm, setSearchTerm] = useState('')
        const [isOpen, setIsOpen] = useState(false)
        const [selectedNames, setSelectedNames] = useState<string[]>([])

        const dropdownRef = useRef<HTMLDivElement>(null)
        const optionsContainerRef = useRef<HTMLDivElement>(null)
        const debouncedSearchTerm = useDebounce(searchTerm, 500)
        const {
            options: placeTypes,
            error,
            isLoading: loading,
            isLoadingMore,
            hasMore,
            loadMore,
            mutate,
        } = useCachedInfiniteFilterOptions<ITypeOfPlace>({
            isOpen,
            endpoint: '/api/place',
            search: debouncedSearchTerm,
            params: { limit: '150' },
        })

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

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value)
        }

        const handleScroll = useCallback(() => {
            const container = optionsContainerRef.current
            if (!container || !hasMore || isLoadingMore) return

            const { scrollTop, scrollHeight, clientHeight } = container
            if (scrollHeight - scrollTop - clientHeight < 80) loadMore()
        }, [hasMore, isLoadingMore, loadMore])

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
        }

        const handleRetry = () => {
            void mutate()
        }

        const handleClear = () => {
            setSearchTerm('')
            setSelectedNames([])
            onChange('')
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
                                <div
                                    ref={optionsContainerRef}
                                    className={styles.wrapper_option}
                                    onScroll={handleScroll}
                                >
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
                                    {isLoadingMore && (
                                        <div className={styles.loading}>Загрузка...</div>
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

TypeOfPlaceSelect.displayName = 'TypeOfPlaceSelect'
