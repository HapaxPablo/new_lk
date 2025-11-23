'use client'
import { JSX, useEffect, useRef, useState, useCallback } from 'react'
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

interface FiltersPanelProps {
  isOpen: boolean
  onClose: () => void
}

const FiltersPanel = ({ isOpen, onClose }: FiltersPanelProps): JSX.Element => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const panelRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const brandSelectRef = useRef<{ handleClearAll: () => void }>(null)

  const [currentFilters, setCurrentFilters] = useState<ISavedFilters>({})
  const [savePermanently, setSavePermanently] = useState<boolean>(false)
  const [isSettingsLoaded, setIsSettingsLoaded] = useState<boolean>(false)

  // Загружаем настройки и фильтры при монтировании
  useEffect(() => {
    const loadSettingsAndFilters = () => {
      // Загружаем настройки
      const settings = getStorageSettings()
      const permanent = settings?.savePermanently ?? false
      setSavePermanently(permanent)

      // Загружаем фильтры согласно настройкам
      const savedFilters = getFiltersFromStorage(permanent)
      if (savedFilters) {
        setCurrentFilters(savedFilters)

        // Применяем сохраненные фильтры к URL
        const params = new URLSearchParams()
        Object.entries(savedFilters).forEach(([key, value]) => {
          if (value) {
            params.set(key, value)
          }
        })
        router.push(`${pathname}?${params.toString()}`)
      }

      setIsSettingsLoaded(true)
    }

    loadSettingsAndFilters()
  }, [pathname, router])

  useClickOutside([panelRef], onClose, isOpen)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleFilterChange = (filterKey: string, value: string): void => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(filterKey, value)
    } else {
      params.delete(filterKey)
    }

    params.set('page', '1')
    console.log('PARAMSFILTERPANELS', params.toString())

    router.push(`${pathname}?${params.toString()}`)

    // Обновляем текущие фильтры
    const newFilters = { ...currentFilters }
    if (value) {
      newFilters[filterKey] = value
    } else {
      delete newFilters[filterKey]
    }

    setCurrentFilters(newFilters)

    // Сохраняем только если настройки загружены
    if (isSettingsLoaded) {
      saveFiltersToStorage(newFilters, savePermanently)
    }
  }

  const handleSaveSettingChange = (): void => {
    const newValue = !savePermanently
    setSavePermanently(newValue)

    // Сохраняем фильтры с новыми настройками
    if (Object.keys(currentFilters).length > 0) {
      saveFiltersToStorage(currentFilters, newValue)
    }
  }

  const handleResetFilters = (): void => {
    // Очищаем URL параметры
    const params = new URLSearchParams()
    router.push(`${pathname}?${params.toString()}`)

    // Очищаем состояние и хранилища
    setCurrentFilters({})
    clearFiltersFromStorage()

    // Очищаем бренды
    if (brandSelectRef.current) {
      brandSelectRef.current.handleClearAll()
    }
  }

  const getCurrentValue = (key: string): string => {
    return searchParams.get(key) || currentFilters[key] || ''
  }

  const handleBrandChange = (brandId: string) => {
    handleFilterChange('brand_id', brandId)
  }

  return (
    <>
      <div
        ref={overlayRef}
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
      >
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
            <label className={styles.filterLabel}>Бренд</label>
            <BrandSelect
              ref={brandSelectRef}
              value={getCurrentValue('brand_id')}
              onChange={handleBrandChange}
              placeholder="Поиск по ID, названию или коду ..."
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Статус</label>
            <select
              className={styles.filterSelect}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              value={getCurrentValue('status')}
            >
              <option value="">Все статусы</option>
              <option value="active">Активный</option>
              <option value="inactive">Неактивный</option>
            </select>
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
