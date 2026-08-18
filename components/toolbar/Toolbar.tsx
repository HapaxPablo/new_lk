'use client'
import { SlidersHorizontal } from 'lucide-react'
import { JSX, useState } from 'react'
import { NomenclatureFiltersPanel } from '../panels/filter-panels/NomenclatureFiltersPanel'
import { SearchForm } from '../search-form/SearchForm'
import styles from './Toolbar.module.scss'
import { Button } from '../ui/button/Button'
import { useGeoStore } from '@/store/geoStore'
import { useNomenclatureFiltersStore } from '@/store/useNomenclatureFiltersStore'
import CitiesSlider from './cities/CitiesSlider'
// const CitiesSlider = dynamic(
//   () =>
//     import('./cities/CitiesSlider').then((mod) => ({
//       default: mod.default,
//     })),
//   {
//     ssr: false,
//     loading: () => <LoaderSkeletonRow />,
//   }
// )

interface ToolbarProps {
  totalItems: number
  variant?: 'default' | 'catalog'
}

const Toolbar = ({
  totalItems,
  variant = 'default',
}: ToolbarProps): JSX.Element => {
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const selectedCity = useGeoStore((state) => state.selectedCity)
  const filters = useNomenclatureFiltersStore((state) => state.filters)
  const setFilter = useNomenclatureFiltersStore((state) => state.setFilter)
  const resetFilters = useNomenclatureFiltersStore(
    (state) => state.resetFilters
  )

  const toggleFilters = (): void => {
    setShowFilters(!showFilters)
  }

  const resetCatalogFilters = (): void => {
    resetFilters()
  }

  const handleTypeOfPlaceChange = (names: string): void => {
    setFilter('type_of_place', names || undefined)
  }

  const toggleTc = (): void => {
    const current = filters.type_of_place || ''
    const values = current
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const isActive = values.includes('Торговый центр')
    const next = isActive
      ? values.filter((s) => s !== 'Торговый центр').join(',')
      : [...values, 'Торговый центр'].join(',')

    handleTypeOfPlaceChange(next)
  }

  const toggleContentTypes = (contentTypes: string[]): void => {
    const current = (filters.content_types || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
    const isActive = contentTypes.some((value) => current.includes(value))
    const next = isActive
      ? current.filter((value) => !contentTypes.includes(value))
      : Array.from(new Set([...current, ...contentTypes]))

    setFilter('content_types', next.join(',') || undefined)
  }

  const toggleMaxPrice = (): void =>
    setFilter('price_to', filters.price_to === '200' ? undefined : '200')

  // const handleTcClick = (): void => {
  //   const current = searchParams.get('type_of_place') || ''
  //   const values = current.split(',').map((s) => s.trim()).filter(Boolean)
  //   const isActive = values.includes('Торговый центр')
  //   const next = isActive
  //     ? values.filter((s) => s !== 'Торговый центр').join(',')
  //     : [...values, 'Торговый центр'].join(',')
  //   handleTypeOfPlaceChange(next)
  // }

  const isTcActive = (filters.type_of_place || '')
    .split(',')
    .map((s) => s.trim())
    .includes('Торговый центр')
  const selectedContentTypes = (filters.content_types || '')
    .split(',')
    .filter(Boolean)
  const isAudioActive = [
    'audio',
    'audio_video',
    'audio_image',
    'audio_video_image',
  ].some((value) => selectedContentTypes.includes(value))
  const isVideoActive = [
    'video',
    'audio_video',
    'video_image',
    'audio_video_image',
  ].some((value) => selectedContentTypes.includes(value))
  const isMaxPriceActive = filters.price_to === '200'

  return (
    <>
      <div
        className={`${styles.toolbar} ${
          variant === 'catalog' ? styles.catalogToolbar : ''
        }`}
      >
        <div className={styles.mainPanel}>
          <div className={styles.totalItems}>Всего: {totalItems}</div>
          <SearchForm
            initialSearch={filters.search || ''}
            onSearchChange={(value) => setFilter('search', value || undefined)}
            hideButton={variant !== 'catalog'}
            className={styles.searchForm}
            placeholder="Напишите здесь город, улицу, название места или название арендатора для отбора"
            buttonText="Найти"
            buttonClassName={
              variant === 'catalog' ? styles.catalogSearchButton : ''
            }
          />

          <button
            type="button"
            className={styles.tooltipContainer}
            data-tooltip="Дополнительные фильтры"
            onClick={toggleFilters}
            aria-label="Открыть дополнительные фильтры"
            aria-expanded={showFilters}
          >
            <SlidersHorizontal
              size={24}
              className={`${styles.icon} ${showFilters ? styles.activeIcon : ''}`}
            />
          </button>
        </div>

        <div className={styles.quickFilters}>
          <Button
            type="button"
            onClick={toggleTc}
            variant={isTcActive ? 'primary' : 'default'}
            rel="nofollow noopener"
            className={styles.filterChip}
          >
            Торговый центр
          </Button>

          {variant === 'catalog' && (
            <>
              <Button
                type="button"
                onClick={() =>
                  toggleContentTypes([
                    'audio',
                    'audio_video',
                    'audio_image',
                    'audio_video_image',
                  ])
                }
                variant={isAudioActive ? 'primary' : 'default'}
                className={styles.filterChip}
              >
                Аудиореклама
              </Button>
              <Button
                type="button"
                onClick={() =>
                  toggleContentTypes([
                    'video',
                    'audio_video',
                    'video_image',
                    'audio_video_image',
                  ])
                }
                variant={isVideoActive ? 'primary' : 'default'}
                className={styles.filterChip}
              >
                Видеореклама
              </Button>
              <Button
                type="button"
                onClick={toggleMaxPrice}
                variant={isMaxPriceActive ? 'primary' : 'default'}
                className={styles.filterChip}
              >
                До 200 ₽/день
              </Button>
            </>
          )}

          {variant === 'catalog' && (
            <button
              type="button"
              onClick={resetCatalogFilters}
              className={styles.resetButton}
            >
              Сбросить
            </button>
          )}
        </div>

        <div className={styles.citiesRow}>
          <span className={styles.citiesLabel}>Города</span>
          <div className={styles.citiesWrapper}>
            <CitiesSlider
              name={selectedCity?.name || null}
              typeOfPlace={filters.type_of_place}
            />
          </div>
        </div>
      </div>
      <NomenclatureFiltersPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </>
  )
}

export default Toolbar
