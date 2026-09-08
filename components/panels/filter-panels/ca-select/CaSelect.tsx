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
import { useClickOutside } from '@/hooks/useClickOutside'
import {
  useCachedInfiniteFilterOptions,
} from '@/hooks/data/useCachedFilterOptions'
import { ICounterparty } from '@/types/counterparty'
import styles from './CaStyles.module.css'

interface CounterpartySelectProps {
  value: string // строка с ID контрагентов через запятую
  onChange: (counterpartyIds: string) => void // передаем строку с ID через запятую
  placeholder?: string
  disabled?: boolean
}

export const CaSelect = forwardRef(
  (
    {
      value,
      onChange,
      placeholder = 'Выберите контрагентов',
      disabled = false,
    }: CounterpartySelectProps,
    ref
  ) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCounterpartyIds, setSelectedCounterpartyIds] = useState<
      string[]
    >([])

    const dropdownRef = useRef<HTMLDivElement>(null)
    const optionsContainerRef = useRef<HTMLDivElement>(null)
    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    const {
      options: counterparties,
      error,
      isLoading: loading,
      isLoadingMore,
      hasMore,
      loadMore,
      mutate,
    } = useCachedInfiniteFilterOptions<ICounterparty>({
      isOpen,
      endpoint: '/api/counterparties/filter-options',
      search: debouncedSearchTerm,
      params: { limit: '150' },
    })

    // Используем хук для закрытия при клике вне элемента
    useClickOutside(
      [dropdownRef],
      () => {
        setIsOpen(false)
      },
      isOpen,
      true
    )

    // Преобразуем строку value в массив ID
    useEffect(() => {
      if (value) {
        const ids = value.split(',').filter((id) => id.trim() !== '')
        setSelectedCounterpartyIds(ids)
      } else {
        setSelectedCounterpartyIds([])
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

    const handleCounterpartyToggle = (counterparty: ICounterparty) => {
      const isSelected = selectedCounterpartyIds.includes(counterparty.id)
      let newSelectedCounterparties: string[]

      if (isSelected) {
        // Убираем контрагента из выбранных
        newSelectedCounterparties = selectedCounterpartyIds.filter(
          (id) => id !== counterparty.id
        )
      } else {
        // Добавляем контрагента к выбранным
        newSelectedCounterparties = [
          ...selectedCounterpartyIds,
          counterparty.id,
        ]
      }

      setSelectedCounterpartyIds(newSelectedCounterparties)

      // Формируем строку с ID через запятую и передаем в onChange
      const counterpartyIdsString = newSelectedCounterparties.join(',')
      onChange(counterpartyIdsString)
    }

    const handleInputFocus = () => {
      setIsOpen(true)
    }

    const handleRetry = () => {
      void mutate()
    }

    const handleClear = () => {
      setSearchTerm('')
      setSelectedCounterpartyIds([])
      onChange('')
    }

    const handleSelectAll = () => {
      const allCounterpartyIds = counterparties.map(
        (counterparty) => counterparty.id
      )
      setSelectedCounterpartyIds(allCounterpartyIds)
      const counterpartyIdsString = allCounterpartyIds.join(',')
      onChange(counterpartyIdsString)
    }

    const handleClearAll = () => {
      setSelectedCounterpartyIds([])
      setSearchTerm('')
      onChange('')
    }

    // Экспортируем функции для родительского компонента
    useImperativeHandle(ref, () => ({
      handleClearAll,
    }))

    // Отображаем контрагентов в зависимости от поискового запроса
    const displayedCounterparties = counterparties

    // Текст для плейсхолдера с количеством выбранных контрагентов
    const placeholderText =
      selectedCounterpartyIds.length > 0
        ? `Выбрано контрагентов: ${selectedCounterpartyIds.length}`
        : placeholder

    return (
      <div className={styles.counterpartySelect} ref={dropdownRef}>
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
                  ? `Поиск контрагентов "${searchTerm}"...`
                  : 'Загрузка контрагентов...'}
              </div>
            ) : displayedCounterparties.length === 0 ? (
              <div className={styles.noResults}>
                {searchTerm
                  ? `Контрагенты по запросу "${searchTerm}" не найдены`
                  : 'Нет доступных контрагентов'}
              </div>
            ) : (
              <div className={styles.options}>
                <div className={styles.optionsHeader}>
                  <div className={styles.headerInfo}>
                    {searchTerm
                      ? `Найдено контрагентов: ${displayedCounterparties.length} по запросу "${searchTerm}"`
                      : `Всего контрагентов: ${displayedCounterparties.length}`}
                    {selectedCounterpartyIds.length > 0 &&
                      ` • Выбрано: ${selectedCounterpartyIds.length}`}
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
                  {displayedCounterparties.map((counterparty) => {
                    const isSelected = selectedCounterpartyIds.includes(
                      counterparty.id
                    )

                    return (
                      <div
                        key={counterparty.id}
                        className={`${styles.option} ${
                          isSelected ? styles.selected : ''
                        }`}
                        onClick={() => handleCounterpartyToggle(counterparty)}
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

                        <div className={styles.counterpartyInfo}>
                          <div className={styles.counterpartyName}>
                            {counterparty.name}
                          </div>
                          {counterparty.code1c && (
                            <div className={styles.counterpartyCode1c}>
                              1C: {counterparty.code1c}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {isLoadingMore && <div className={styles.loading}>Загрузка...</div>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)
