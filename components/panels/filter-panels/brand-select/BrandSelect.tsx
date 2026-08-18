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
import { useCachedInfiniteFilterOptions } from '@/hooks/data/useCachedFilterOptions'
import { IBrand } from '@/types/nomenclature'
import styles from './BrandSelect.module.scss'
import { useClickOutside } from '@/hooks/useClickOutside'

interface BrandSelectProps {
  value: string
  onChange: (brandIds: string) => void
  placeholder?: string
  disabled?: boolean
}

export const BrandSelect = forwardRef(
  (
    {
      value,
      onChange,
      placeholder = 'Выберите бренды',
      disabled = false,
    }: BrandSelectProps,
    ref
  ) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([])

    const dropdownRef = useRef<HTMLDivElement>(null)
    const optionsContainerRef = useRef<HTMLDivElement>(null)
    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    const {
      options: brands,
      error,
      isLoading: loading,
      isLoadingMore,
      hasMore,
      loadMore,
      mutate,
    } = useCachedInfiniteFilterOptions<IBrand>({
      isOpen,
      endpoint: '/api/brands',
      search: debouncedSearchTerm,
      searchParam: 'name',
      params: { limit: '150', is_deleted: 'false' },
    })

    // Используем хук для закрытия при клике вне элемента
    useClickOutside(
      [dropdownRef],
      () => {
        setIsOpen(false)
      },
      isOpen, // Включаем хук только когда dropdown открыт
      true
    )

    // Преобразуем строку value в массив ID
    useEffect(() => {
      if (value) {
        const ids = value.split(',').filter((id) => id.trim() !== '')
        setSelectedBrandIds(ids)
      } else {
        setSelectedBrandIds([])
      }
    }, [value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = e.target.value
      setSearchTerm(newSearchTerm)
    }

    const handleScroll = useCallback(() => {
      const container = optionsContainerRef.current
      if (!container || !hasMore || isLoadingMore) return

      const { scrollTop, scrollHeight, clientHeight } = container
      if (scrollHeight - scrollTop - clientHeight < 80) loadMore()
    }, [hasMore, isLoadingMore, loadMore])

    const handleBrandToggle = (brand: IBrand) => {
      const isSelected = selectedBrandIds.includes(brand.id)
      let newSelectedBrands: string[]

      if (isSelected) {
        // Убираем бренд из выбранных
        newSelectedBrands = selectedBrandIds.filter((id) => id !== brand.id)
      } else {
        // Добавляем бренд к выбранным
        newSelectedBrands = [...selectedBrandIds, brand.id]
      }

      setSelectedBrandIds(newSelectedBrands)

      // Формируем строку с ID через запятую и передаем в onChange
      const brandIdsString = newSelectedBrands.join(',')
      onChange(brandIdsString)
    }

    const handleInputFocus = () => {
      setIsOpen(true)
    }

    const handleRetry = () => {
      void mutate()
    }

    const handleClear = () => {
      setSearchTerm('')
      setSelectedBrandIds([])
      onChange('')
    }

    const handleSelectAll = () => {
      const allBrandIds = brands.map((brand) => brand.id)
      setSelectedBrandIds(allBrandIds)
      const brandIdsString = allBrandIds.join(',')
      onChange(brandIdsString)
    }

    const handleClearAll = () => {
      setSelectedBrandIds([])
      setSearchTerm('')
      onChange('')
    }

    // Экспортируем функции для родительского компонента
    useImperativeHandle(ref, () => ({
      handleClearAll,
    }))

    // Отображаем бренды в зависимости от поискового запроса
    const displayedBrands = brands

    // Текст для плейсхолдера с количеством выбранных брендов
    const placeholderText =
      selectedBrandIds.length > 0
        ? `Выбрано брендов: ${selectedBrandIds.length}`
        : placeholder

    return (
      <div className={styles.brandSelect} ref={dropdownRef}>
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

          {/* Индикатор загрузки */}
          {loading && (
            <div className={styles.loader}>
              <div className={styles.spinner}></div>
            </div>
          )}
        </div>

        {/* Сообщение об ошибке */}
        {error && (
          <div className={styles.error}>
            <div className={styles.errorMessage}>{error}</div>
            <button onClick={handleRetry} className={styles.retryButton}>
              Повторить
            </button>
          </div>
        )}

        {/* Выпадающий список */}
        {isOpen && (
          <div className={styles.dropdown}>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                {searchTerm
                  ? `Поиск брендов "${searchTerm}"...`
                  : 'Загрузка брендов...'}
              </div>
            ) : error ? (
              <div className={styles.errorState}>
                <div>Не удалось загрузить бренды</div>
                <button
                  onClick={handleRetry}
                  className={styles.retryButtonSmall}
                >
                  Попробовать снова
                </button>
              </div>
            ) : displayedBrands.length === 0 ? (
              <div className={styles.noResults}>
                {searchTerm
                  ? `Бренды по запросу "${searchTerm}" не найдены`
                  : 'Нет доступных брендов'}
              </div>
            ) : (
              <div className={styles.options}>
                <div className={styles.optionsHeader}>
                  <div className={styles.headerInfo}>
                    {searchTerm
                      ? `Найдено брендов: ${displayedBrands.length} по запросу "${searchTerm}"`
                      : `Всего брендов: ${displayedBrands.length}`}
                    {selectedBrandIds.length > 0 &&
                      ` • Выбрано: ${selectedBrandIds.length}`}
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
                  {displayedBrands.map((brand, key) => {
                    const isSelected = selectedBrandIds.includes(brand.id)

                    return (
                      <div
                        key={`${key}-${brand.id}`}
                        className={`${styles.option} ${
                          isSelected ? styles.selected : ''
                        }`}
                        onClick={() => handleBrandToggle(brand)}
                      >
                        {/* Кастомный чекбокс с галочкой */}
                        <div className={styles.checkbox}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className={styles.checkboxInput}
                          />
                          <span className={styles.checkboxCheckmark} />
                        </div>

                        <div className={styles.brandInfo}>
                          <div className={styles.brandName}>{brand.name}</div>
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

BrandSelect.displayName = 'BrandSelect'
