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
    const [counterparties, setCounterparties] = useState<ICounterparty[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCounterpartyIds, setSelectedCounterpartyIds] = useState<
      string[]
    >([])
    const [error, setError] = useState<string | null>(null)

    const dropdownRef = useRef<HTMLDivElement>(null)
    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    // Функция для скрытия ошибки
    const hideError = useCallback(() => {
      setError(null)
    }, [])

    // Используем хук для закрытия при клике вне элемента
    useClickOutside(
      [dropdownRef],
      () => {
        setIsOpen(false)
        hideError() // Скрываем ошибку при клике вне компонента
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

    const loadCounterparties = useCallback(async (search: string = '') => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()

        if (search) {
          params.set('name', search)
        }

        params.set('limit', '150')
        params.set('page', '1')
        params.set('is_deleted', 'false')

        const response = await fetch(`/api/counterparties?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`Ошибка загрузки: ${response.status}`)
        }

        const data = await response.json()
        console.log('Загружены контрагенты:', data.results || data)
        setCounterparties(data.results || data)
      } catch (error: any) {
        console.error('Ошибка загрузки контрагентов:', error)
        setError(error.message || 'Не удалось загрузить контрагентов')
        setCounterparties([])
      } finally {
        setLoading(false)
      }
    }, [])

    useEffect(() => {
      if (!isOpen || counterparties.length > 0) return
      console.log('Загрузка контрагентов при открытии')
      loadCounterparties('')
    }, [isOpen])

    // Загрузка контрагентов при поиске
    useEffect(() => {
      if (!isOpen) return
      console.log('Поиск контрагентов:', debouncedSearchTerm)
      loadCounterparties(debouncedSearchTerm)
    }, [debouncedSearchTerm, isOpen])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = e.target.value
      setSearchTerm(newSearchTerm)
    }

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

      // Выводим в консоль информацию о выбранных контрагентах
      const selectedCounterpartiesInfo = newSelectedCounterparties.map((id) => {
        const counterpartyInfo = counterparties.find((c) => c.id === id)
        return { id, name: counterpartyInfo?.name || 'Unknown' }
      })
      console.log('Выбранные контрагенты:', selectedCounterpartiesInfo)
    }

    const handleInputFocus = () => {
      console.log('Фокус на поле ввода')
      setIsOpen(true)

      if (counterparties.length === 0 && !loading) {
        loadCounterparties('')
      }
    }

    const handleRetry = () => {
      console.log('Повторная попытка загрузки')
      setError(null)
      loadCounterparties(searchTerm)
    }

    const handleClear = () => {
      setSearchTerm('')
      setSelectedCounterpartyIds([])
      onChange('')
      setError(null)

      if (isOpen) {
        loadCounterparties('')
      }
    }

    const handleSelectAll = () => {
      const allCounterpartyIds = counterparties.map(
        (counterparty) => counterparty.id
      )
      setSelectedCounterpartyIds(allCounterpartyIds)
      const counterpartyIdsString = allCounterpartyIds.join(',')
      onChange(counterpartyIdsString)
      console.log(
        'Выбраны все контрагенты:',
        counterparties.map((c) => ({ id: c.id, name: c.name }))
      )
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
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)
