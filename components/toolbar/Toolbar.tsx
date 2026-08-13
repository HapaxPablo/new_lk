'use client'
import { useClickOutside } from '@/hooks/useClickOutside'
import { SlidersHorizontal } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { JSX, useCallback, useRef, useState } from 'react'
import FiltersPanel from '../panels/filter-panels/FiltersPanels'
import { SearchForm } from '../search-form/SearchForm'
import styles from './Toolbar.module.scss'
import { Button } from '../ui/button/Button'
import { useGeoStore } from '@/store/geoStore'
import CitiesSlider from './cities/CitiesSlider'
import { ModalWrapper } from '../modal/ModalWrapper'
import { useModal } from '@/providers/modal/ModalProvider'
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
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [showLimitOptions, setShowLimitOptions] = useState<boolean>(false)
  const { openModal: openDevelopmentModal } = useModal('development')

  // Получаем город из Zustand store вместо localStorage
  const selectedCity = useGeoStore((state) => state.selectedCity)

  const limitRef = useRef<HTMLDivElement>(null)

  useClickOutside(
    [limitRef],
    () => setShowLimitOptions(false),
    showLimitOptions
  )

  const handleLimitChange = (limit: number): void => {
    const params = new URLSearchParams(searchParams.toString())
    const currentPage = params.get('page')
    params.set('limit', limit.toString())
    params.set('page', currentPage!!)
    router.push(`${pathname}?${params.toString()}`)
    setShowLimitOptions(false)
  }

  const toggleFilters = (): void => {
    setShowFilters(!showFilters)
    setShowLimitOptions(false)
  }

  const toggleLimitOptions = (): void => {
    setShowLimitOptions(!showLimitOptions)
  }

  const resetCatalogFilters = (): void => {
    const params = new URLSearchParams()
    const limit = searchParams.get('limit')
    if (limit) params.set('limit', limit)
    router.push(`${pathname}${params.size ? `?${params.toString()}` : ''}`)
  }

  const handleTypeOfPlaceChange = (names: string): void => {
    const params = new URLSearchParams(searchParams.toString())
    if (names) {
      params.set('type_of_place', names)
    } else {
      params.delete('type_of_place')
    }
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  const buildTcUrl = useCallback((): string => {
    const current = searchParams.get('type_of_place') || ''
    const values = current
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const isActive = values.includes('Торговый центр')
    const next = isActive
      ? values.filter((s) => s !== 'Торговый центр').join(',')
      : [...values, 'Торговый центр'].join(',')

    const params = new URLSearchParams(searchParams.toString())
    if (next) {
      params.set('type_of_place', next)
    } else {
      params.delete('type_of_place')
    }
    params.set('page', '1')

    return `${pathname}?${params.toString()}`
  }, [searchParams, pathname])

  // const handleTcClick = (): void => {
  //   const current = searchParams.get('type_of_place') || ''
  //   const values = current.split(',').map((s) => s.trim()).filter(Boolean)
  //   const isActive = values.includes('Торговый центр')
  //   const next = isActive
  //     ? values.filter((s) => s !== 'Торговый центр').join(',')
  //     : [...values, 'Торговый центр'].join(',')
  //   handleTypeOfPlaceChange(next)
  // }

  const isTcActive = (searchParams.get('type_of_place') || '')
    .split(',')
    .map((s) => s.trim())
    .includes('Торговый центр')

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
            href={buildTcUrl()}
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
                variant="default"
                onClick={openDevelopmentModal}
                className={styles.filterChip}
              >
                Аудиореклама
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={openDevelopmentModal}
                className={styles.filterChip}
              >
                Видеореклама
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={openDevelopmentModal}
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
            <CitiesSlider name={selectedCity?.name || null} />
          </div>
        </div>
      </div>
      <FiltersPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
      {variant === 'catalog' && (
        <ModalWrapper id="development" title="Функция в разработке">
          <p className="text-center text-gray-600">
            Этот фильтр появится после подключения к API.
          </p>
        </ModalWrapper>
      )}
    </>
  )
}

export default Toolbar
