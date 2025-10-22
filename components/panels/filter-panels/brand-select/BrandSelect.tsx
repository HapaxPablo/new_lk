'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { IBrand } from '@/types/nomenclature'
import styles from './BrandSelect.module.scss'

interface BrandSelectProps {
  value: string
  onChange: (brandId: string) => void
  placeholder?: string
  disabled?: boolean
}

export const BrandSelect = ({
  value,
  onChange,
  placeholder = 'Выберите бренд',
  disabled = false,
}: BrandSelectProps) => {
  const [brands, setBrands] = useState<IBrand[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<IBrand | null>(null)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const loadBrands = useCallback(async (search: string = '') => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (search) {
        params.set('name', search)
      }

      params.set('limit', '50')
      params.set('page', '1')
      params.set('is_deleted', 'false')

      const response = await fetch(`/api/brands?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`)
      }

      const data = await response.json()
      console.log('Загружены бренды:', data.results || data)
      setBrands(data.results || data)
    } catch (error: any) {
      console.error('Ошибка загрузки брендов:', error)
      setError(error.message || 'Не удалось загрузить бренды')
      setBrands([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Единый эффект для загрузки при изменении поискового запроса
  useEffect(() => {
    if (!isOpen) return // Не загружаем если панель закрыта

    console.log('Загрузка брендов с запросом:', debouncedSearchTerm)
    loadBrands(debouncedSearchTerm)
  }, [debouncedSearchTerm, isOpen, loadBrands])

  // Установка выбранного бренда при изменении value извне
  useEffect(() => {
    if (value && brands.length > 0) {
      const brand = brands.find((b) => b.id === value)
      if (brand) {
        setSelectedBrand(brand)
        // НЕ меняем searchTerm здесь, чтобы не сбрасывать ввод пользователя
      }
    } else if (!value) {
      setSelectedBrand(null)
      // НЕ сбрасываем searchTerm здесь
    }
  }, [value, brands])

  // Установка начального значения при монтировании
  useEffect(() => {
    if (value) {
      setSearchTerm(value)
    }
  }, [value, selectedBrand])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value
    setSearchTerm(newSearchTerm)

    // Если очистили поле, сбрасываем выбор
    if (!newSearchTerm) {
      onChange('')
      setSelectedBrand(null)
    }
  }

  const handleBrandSelect = (brand: IBrand) => {
    console.log('Выбран бренд:', brand.name, brand.id)
    setSelectedBrand(brand)
    setSearchTerm(brand.name) // Устанавливаем имя бренда в поле ввода
    onChange(brand.name) //TODO переделать на id
    setIsOpen(false)
    setError(null)
  }

  const handleInputFocus = () => {
    console.log('Фокус на поле ввода')
    setIsOpen(true)

    // Если бренды еще не загружены, загружаем при первом открытии
    if (brands.length === 0 && !loading) {
      loadBrands(searchTerm)
    }
  }

  const handleInputBlur = (e: React.FocusEvent) => {
    console.log('Потеря фокуса')
    setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  const handleRetry = () => {
    console.log('Повторная попытка загрузки')
    setError(null)
    loadBrands(searchTerm)
  }

  const handleClear = () => {
    console.log('Очистка выбора')
    setSearchTerm('')
    setSelectedBrand(null)
    onChange('')
    setError(null)

    // Если панель открыта, перезагружаем все бренды
    if (isOpen) {
      loadBrands('')
    }
  }

  // Отображаем загруженные бренды
  const displayedBrands = brands

  return (
    <div className={styles.brandSelect}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
        />

        {/* Кнопка очистки */}
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
              <button onClick={handleRetry} className={styles.retryButtonSmall}>
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
                Найдено брендов: {displayedBrands.length}
                {searchTerm && ` по запросу "${searchTerm}"`}
              </div>

              {displayedBrands.map((brand) => (
                <div
                  key={brand.id}
                  className={`${styles.option} ${
                    selectedBrand?.id === brand.id ? styles.selected : ''
                  }`}
                  onClick={() => handleBrandSelect(brand)}
                >
                  <div className={styles.brandName}>{brand.name}</div>
                  <div className={styles.brandDetails}>
                    <span className={styles.brandId}>ID: {brand.id}</span>
                    {brand.code1c && (
                      <span className={styles.brandCode1c}>
                        1C: {brand.code1c}
                      </span>
                    )}
                    <span className={styles.brandCreated}>
                      Создан:{' '}
                      {new Date(brand.created).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
