'use client'

import { JSX, useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button/Button'
import { X } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'
import {
  ISavedFilters,
  saveFiltersToStorage,
  getFiltersFromStorage,
  clearFiltersFromStorage,
  getStorageSettings,
} from '@/utils/storage'
import styles from './FiltersPanel.module.scss'
import dynamic from 'next/dynamic'
import LoaderSkeleton from '@/components/ui/loader/LoaderSkeleton'
import StatusSelect from './status-select/StatusSelect'
import { CitySelect } from './cities-select/CitySelect'
import { TypeOfPlaceSelect } from './place-select/TypeOfPlaceSelect'
import { BrandSelect } from './brand-select/BrandSelect'
import { CaSelect } from './ca-select/CaSelect'
import { useAuth } from '@/providers/auth-provider/AuthProvider'

interface FiltersPanelProps {
  isOpen?: boolean
  onClose?: () => void
}

const FiltersPanel = ({ isOpen, onClose }: FiltersPanelProps): JSX.Element => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const panelRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const brandSelectRef = useRef<{ handleClearAll: () => void }>(null)
  const counterpartySelectRef = useRef<{ handleClearAll: () => void }>(null)
  const statusRef = useRef<{ handleClearAll: () => void }>(null)
  const citySelectRef = useRef<{ handleClearAll: () => void }>(null)
  const placeTypeSelectRef = useRef<{ handleClearAll: () => void }>(null)

  const [currentFilters, setCurrentFilters] = useState<ISavedFilters>({})
  const [savePermanently, setSavePermanently] = useState<boolean>(false)
  const [isSettingsLoaded, setIsSettingsLoaded] = useState<boolean>(false)
  const { isEmployee } = useAuth()

  useEffect(() => {
    const loadSettingsAndFilters = () => {
      const settings = getStorageSettings()
      const permanent = settings?.savePermanently ?? false
      setSavePermanently(permanent)

      const savedFilters = getFiltersFromStorage(permanent)
      if (savedFilters) {
        setCurrentFilters(savedFilters)

        // Сохранённые фильтры — начальное состояние, но они не должны
        // перезаписывать ссылку, с которой пользователь пришёл в каталог.
        if (onClose && Array.from(searchParams.keys()).length === 0) {
          const params = new URLSearchParams()
          Object.entries(savedFilters).forEach(([key, value]) => {
            if (value) {
              params.set(key, value)
            }
          })
          router.push(`${pathname}?${params.toString()}`)
        }
      }

      setIsSettingsLoaded(true)
    }

    loadSettingsAndFilters()
  }, [onClose, pathname, router, searchParams])

  // Используем клик вовне только если есть функция onClose (мобильная версия)
  useClickOutside([panelRef], onClose!!, !!onClose && isOpen)

  useEffect(() => {
    if (isOpen && onClose) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleFilterChange = (filterKey: string, value: string): void => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(filterKey, value)
    } else {
      params.delete(filterKey)
    }

    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)

    const newFilters = { ...currentFilters }
    if (value) {
      newFilters[filterKey] = value
    } else {
      delete newFilters[filterKey]
    }

    setCurrentFilters(newFilters)

    if (isSettingsLoaded) {
      saveFiltersToStorage(newFilters, savePermanently)
    }
  }

  const handleSaveSettingChange = (): void => {
    const newValue = !savePermanently
    setSavePermanently(newValue)

    if (Object.keys(currentFilters).length > 0) {
      saveFiltersToStorage(currentFilters, newValue)
    }
  }

  const handleResetFilters = (): void => {
    const params = new URLSearchParams()
    router.push(`${pathname}?${params.toString()}`)

    setCurrentFilters({})
    clearFiltersFromStorage()

    // Очищаем все селекты
    if (brandSelectRef.current) {
      brandSelectRef.current.handleClearAll()
    }
    if (statusRef.current) {
      statusRef.current.handleClearAll()
    }
    if (counterpartySelectRef.current) {
      counterpartySelectRef.current.handleClearAll()
    }
    if (citySelectRef.current) {
      citySelectRef.current.handleClearAll()
    }
    if (placeTypeSelectRef.current) {
      placeTypeSelectRef.current.handleClearAll()
    }
  }

  const getCurrentValue = (key: string): string => {
    return searchParams.get(key) || currentFilters[key] || ''
  }

  const hasActiveFilters =
    Array.from(searchParams.keys()).some(
      (key) => key !== 'page' && key !== 'limit'
    ) || Object.keys(currentFilters).length > 0

  const handleBrandChange = (brandId: string) => {
    handleFilterChange('brand_id', brandId)
  }

  const handleCaChange = (counterpartyId: string) => {
    handleFilterChange('counterparty_id', counterpartyId)
  }

  const handleStatusChange = (status: string) => {
    handleFilterChange('status', status === '3' ? '' : status)
  }

  const handleCityChange = (citySlug: string) => {
    handleFilterChange('city_slug', citySlug)
  }

  const handleContentTypesChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const values = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    )
    handleFilterChange('content_types', values.join(','))
  }

  return (
    <>
      {/* Overlay только для мобильной версии (когда есть onClose) */}
      {onClose && (
        <div
          ref={overlayRef}
          className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
          onClick={onClose}
        />
      )}

      <div
        ref={panelRef}
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''} ${
          !onClose ? styles.desktopPanel : ''
        }`}
      >
        {onClose && (
          <div className={styles.panelHeader}>
            <h3>Фильтры</h3>
            <Button
              variant="default"
              onClick={onClose}
              className={styles.closeButton}
            >
              <X size={20} />
            </Button>
          </div>
        )}

        {!onClose && (
          <div className={styles.panelHeader}>
            <h3>Фильтры</h3>
          </div>
        )}

        <div className={styles.panelContent}>
          <div className={styles.saveToggle}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={savePermanently}
                onChange={handleSaveSettingChange}
                className={styles.toggleInput}
              />
              <span className={styles.toggleSlider} />
              <span className={styles.toggleText}>
                {savePermanently
                  ? 'Сохранять постоянно'
                  : 'Сохранять на сессию'}
              </span>
            </label>
            <div className={styles.toggleDescription}>
              {savePermanently
                ? 'Фильтры сохранятся после закрытия браузера'
                : 'Фильтры очистятся при закрытии вкладки'}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Города</label>
            <CitySelect
              ref={citySelectRef}
              value={getCurrentValue('city_slug')}
              onChange={handleCityChange}
              placeholder="Поиск города..."
              redirectOnSelect={false}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Бренд</label>
            <BrandSelect
              ref={brandSelectRef}
              value={getCurrentValue('brand_id')}
              onChange={handleBrandChange}
              placeholder="Поиск по ID, названию или коду ..."
            />
          </div>

          <div className={styles.filterGroup}>
            <label
              htmlFor="status-select"
              id="status-label"
              className={styles.filterLabel}
            >
              Статус устройства
            </label>
            <StatusSelect
              id="status-select"
              ref={statusRef}
              value={getCurrentValue('status')}
              onChange={handleStatusChange}
              placeholder="Выберите статус ..."
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Тип места</label>
            <TypeOfPlaceSelect
              ref={placeTypeSelectRef}
              value={getCurrentValue('type_of_place')}
              onChange={(value) => handleFilterChange('type_of_place', value)}
              placeholder="Выберите типы мест..."
            />
          </div>

          {isEmployee && (
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Контрагент</label>
              <CaSelect
                ref={counterpartySelectRef}
                value={getCurrentValue('counterparty_id')}
                onChange={handleCaChange}
                placeholder="Поиск контрагентов..."
              />
            </div>
          )}

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Форматы размещения</label>
            <select
              className={styles.filterSelect}
              multiple
              onChange={handleContentTypesChange}
              value={getCurrentValue('content_types')
                .split(',')
                .filter(Boolean)}
            >
              <option value="audio">Аудиореклама</option>
              <option value="video">Видеореклама</option>
              <option value="audio_video">Аудио + видео</option>
              <option value="audio_image">Аудио + изображение</option>
              <option value="video_image">Видео + изображение</option>
              <option value="audio_video_image">
                Аудио + видео + изображение
              </option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Стоимость в день, ₽</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                key={getCurrentValue('price_from')}
                type="number"
                min="0"
                className={styles.filterSelect}
                placeholder="От"
                defaultValue={getCurrentValue('price_from')}
                onBlur={(event) =>
                  handleFilterChange('price_from', event.target.value)
                }
              />
              <input
                key={getCurrentValue('price_to')}
                type="number"
                min="0"
                className={styles.filterSelect}
                placeholder="До"
                defaultValue={getCurrentValue('price_to')}
                onBlur={(event) =>
                  handleFilterChange('price_to', event.target.value)
                }
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Фото фасада</label>
            <select
              className={styles.filterSelect}
              onChange={(event) =>
                handleFilterChange('has_facade', event.target.value)
              }
              value={getCurrentValue('has_facade')}
            >
              <option value="">Не важно</option>
              <option value="true">Только с фото</option>
              <option value="false">Без фото</option>
            </select>
          </div>

          <Button
            variant="default"
            onClick={handleResetFilters}
            className={styles.resetButton}
            disabled={!hasActiveFilters}
          >
            Сбросить фильтры
          </Button>
        </div>
      </div>
    </>
  )
}

export default FiltersPanel
