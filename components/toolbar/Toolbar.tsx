'use client'
import { useClickOutside } from '@/hooks/useClickOutside'
import { Settings, SlidersHorizontal } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { JSX, useCallback, useRef, useState } from 'react'
import FiltersPanel from '../panels/filter-panels/FiltersPanels'
import { SearchForm } from '../search-form/SearchForm'
import styles from './Toolbar.module.scss'
import { Button } from '../ui/button/Button'
import { useGeoStore } from '@/store/geoStore'
import dynamic from 'next/dynamic'
import { LoaderSkeletonRow } from '../ui/loader/LoaderSkeleton'
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
}

const Toolbar = ({ totalItems }: ToolbarProps): JSX.Element => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [showLimitOptions, setShowLimitOptions] = useState<boolean>(false)

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
    const values = current.split(',').map((s) => s.trim()).filter(Boolean)
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
      <div className={styles.toolbar}>
        <div className={styles.mainPanel}>
          <div className={styles.totalItems}>
            Всего: {totalItems}
          </div>
          <SearchForm
            hideButton
            className={styles.searchForm}
            placeholder='Напишите здесь город, улицу, название места или название арендатора для отбора'
          />

          <div className={styles.tooltipContainer} data-tooltip="Фильтры">
            <SlidersHorizontal
              size={24}
              onClick={toggleFilters}
              className={`${styles.icon} ${showFilters ? styles.activeIcon : ''}`}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        {/* Быстрый фильтр: Торговый центр */}
        <div className="flex flex-row items-center gap-4">


          <Button
            href={buildTcUrl()}
            variant={isTcActive ? 'primary' : 'default'}
            // onClick={handleTcClick}
            // target="_blank"
            rel="nofollow noopener"

          >
            Торговый центр
          </Button>

          {/* CitiesSlider с правильной обработкой null */}
          <CitiesSlider name={selectedCity?.name || null} />
        </div>
      </div>
      <FiltersPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </>
  )
}

export default Toolbar