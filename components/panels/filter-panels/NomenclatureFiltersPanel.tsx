'use client'

import dynamic from 'next/dynamic'
import { JSX, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button/Button'
import LoaderSkeleton from '@/components/ui/loader/LoaderSkeleton'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useNomenclatureFiltersStore } from '@/store/useNomenclatureFiltersStore'
import { useAuth } from '@/providers/auth-provider/AuthProvider'
import styles from './FiltersPanel.module.scss'
import StatusSelect from './status-select/StatusSelect'
import { CitySelect } from './cities-select/CitySelect'
import { TypeOfPlaceSelect } from './place-select/TypeOfPlaceSelect'

const BrandSelect = dynamic(
  () =>
    import('./brand-select/BrandSelect').then((mod) => ({
      default: mod.BrandSelect,
    })),
  { ssr: false, loading: () => <LoaderSkeleton /> }
)

const CaSelect = dynamic(
  () =>
    import('./ca-select/CaSelect').then((mod) => ({ default: mod.CaSelect })),
  { ssr: false, loading: () => <LoaderSkeleton /> }
)

interface NomenclatureFiltersPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NomenclatureFiltersPanel({
  isOpen,
  onClose,
}: NomenclatureFiltersPanelProps): JSX.Element {
  const panelRef = useRef<HTMLDivElement>(null)
  const filters = useNomenclatureFiltersStore((state) => state.filters)
  const setFilter = useNomenclatureFiltersStore((state) => state.setFilter)
  const resetFilters = useNomenclatureFiltersStore(
    (state) => state.resetFilters
  )
  const { isEmployee } = useAuth()

  useClickOutside([panelRef], onClose, isOpen)

  const hasActiveFilters = Object.keys(filters).length > 0
  const contentTypes = filters.content_types?.split(',').filter(Boolean) ?? []

  return (
    <>
      <div
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
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Города</label>
            <CitySelect
              value={filters.city_slug || ''}
              onChange={(value) => setFilter('city_slug', value)}
              placeholder="Поиск города..."
              redirectOnSelect={false}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Бренд</label>
            <BrandSelect
              value={filters.brand_id || ''}
              onChange={(value) => setFilter('brand_id', value)}
              placeholder="Поиск по ID, названию или коду..."
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="nomenclature-status" className={styles.filterLabel}>
              Статус устройства
            </label>
            <StatusSelect
              id="nomenclature-status"
              value={filters.status || ''}
              onChange={(value) =>
                setFilter('status', value === '3' ? undefined : value)
              }
              placeholder="Выберите статус..."
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Тип места</label>
            <TypeOfPlaceSelect
              value={filters.type_of_place || ''}
              onChange={(value) => setFilter('type_of_place', value)}
              placeholder="Выберите типы мест..."
            />
          </div>

          {isEmployee && (
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Контрагент</label>
              <CaSelect
                value={filters.counterparty_id || ''}
                onChange={(value) => setFilter('counterparty_id', value)}
                placeholder="Поиск контрагентов..."
              />
            </div>
          )}

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Форматы размещения</label>
            <select
              className={styles.filterSelect}
              multiple
              value={contentTypes}
              onChange={(event) =>
                setFilter(
                  'content_types',
                  Array.from(
                    event.target.selectedOptions,
                    (option) => option.value
                  ).join(',')
                )
              }
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
                key={filters.price_from}
                type="number"
                min="0"
                className={styles.filterSelect}
                placeholder="От"
                defaultValue={filters.price_from}
                onBlur={(event) => setFilter('price_from', event.target.value)}
              />
              <input
                key={filters.price_to}
                type="number"
                min="0"
                className={styles.filterSelect}
                placeholder="До"
                defaultValue={filters.price_to}
                onBlur={(event) => setFilter('price_to', event.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Фото фасада</label>
            <select
              className={styles.filterSelect}
              value={filters.has_facade || ''}
              onChange={(event) =>
                setFilter(
                  'has_facade',
                  event.target.value as 'true' | 'false' | undefined
                )
              }
            >
              <option value="">Не важно</option>
              <option value="true">Только с фото</option>
              <option value="false">Без фото</option>
            </select>
          </div>

          <Button
            variant="default"
            onClick={resetFilters}
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
