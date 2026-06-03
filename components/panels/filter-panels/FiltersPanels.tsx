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
const BrandSelect = dynamic(
  () =>
    import('../filter-panels/brand-select/BrandSelect').then((mod) => ({
      default: mod.BrandSelect,
    })),
  {
    ssr: false,
    loading: () => <LoaderSkeleton />,
  }
)

const CaSelect = dynamic(
  () =>
    import('../filter-panels/ca-select/CaSelect').then((mod) => ({
      default: mod.CaSelect,
    })),
  {
    ssr: false,
    loading: () => <LoaderSkeleton />,
  }
)

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

  const [currentFilters, setCurrentFilters] = useState<ISavedFilters>({})
  const [savePermanently, setSavePermanently] = useState<boolean>(false)
  const [isSettingsLoaded, setIsSettingsLoaded] = useState<boolean>(false)

  useEffect(() => {
    const loadSettingsAndFilters = () => {
      const settings = getStorageSettings()
      const permanent = settings?.savePermanently ?? false
      setSavePermanently(permanent)

      const savedFilters = getFiltersFromStorage(permanent)
      if (savedFilters) {
        setCurrentFilters(savedFilters)

        // Применяем сохраненные фильтры к URL только если панель не всегда открыта (не десктоп)
        if (onClose) {
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
  }, [])

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
  }

  const getCurrentValue = (key: string): string => {
    return searchParams.get(key) || currentFilters[key] || ''
  }

  const handleBrandChange = (brandId: string) => {
    handleFilterChange('brand_id', brandId)
  }

  const handleCaChange = (counterpartyId: string) => {
    handleFilterChange('counterparty_id', counterpartyId)
  }

  const handleStatusChange = (status: string) => {
    handleFilterChange('status', status)
  }

  const handleCityChange = (cityName: string) => {
    // Город не сохраняем в фильтры, так как происходит редирект
    // handleFilterChange('city', cityName)
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
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''} ${!onClose ? styles.desktopPanel : ''
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
              value={getCurrentValue('city')}
              onChange={handleCityChange}
              placeholder="Поиск города..."
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
            <label className={styles.filterLabel}>Контрагент</label>
            <CaSelect
              ref={counterpartySelectRef}
              value={getCurrentValue('counterparty_id')}
              onChange={handleCaChange}
              placeholder="Поиск контрагентов ..."
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor='status-select' id="status-label" className={styles.filterLabel}>Статус устройства</label>
            <StatusSelect
              id="status-select"
              ref={statusRef}
              value={getCurrentValue('status')}
              onChange={handleStatusChange}
              placeholder="Выберите статус ..."
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Категория</label>
            <select
              className={styles.filterSelect}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              value={getCurrentValue('category')}
            >
              <option value="">Все категории</option>
              <option value="category1">Категория 1</option>
              <option value="category2">Категория 2</option>
              <option value="category3">Категория 3</option>
            </select>
          </div>

          <Button
            variant="default"
            onClick={handleResetFilters}
            className={styles.resetButton}
            disabled={Object.keys(currentFilters).length === 0}
          >
            Сбросить фильтры
          </Button>
        </div>
      </div>
    </>
  )
}

export default FiltersPanel