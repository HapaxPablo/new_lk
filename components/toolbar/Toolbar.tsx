'use client'
import { useClickOutside } from '@/hooks/useClickOutside'
import { ListChecks, Settings } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { JSX, useRef, useState } from 'react'
import FiltersPanel from '../panels/filter-panels/FiltersPanels'
import { SearchForm } from '../search-form/SearchForm'
import styles from './Toolbar.module.scss'

interface ToolbarProps {
  totalItems: number
  currentLimit: number
}

const Toolbar = ({ totalItems, currentLimit }: ToolbarProps): JSX.Element => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [showLimitOptions, setShowLimitOptions] = useState<boolean>(false)

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

  const handleTcClick = (): void => {
    const current = searchParams.get('type_of_place') || ''
    const values = current.split(',').map((s) => s.trim()).filter(Boolean)
    const isActive = values.includes('Торговый центр')
    const next = isActive
      ? values.filter((s) => s !== 'Торговый центр').join(',')
      : [...values, 'Торговый центр'].join(',')
    handleTypeOfPlaceChange(next)
  }

  const isTcActive = (searchParams.get('type_of_place') || '')
    .split(',')
    .map((s) => s.trim())
    .includes('Торговый центр')

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.mainPanel}>
          <div className={styles.totalItems}>Всего: {totalItems}</div>
          <SearchForm hideButton className={styles.searchForm} />

          <div className={styles.tooltipContainer} data-tooltip="Фильтры">
            <Settings
              size={24}
              onClick={toggleFilters}
              className={`${styles.icon} ${showFilters ? styles.activeIcon : ''}`}
            />
          </div>

          <div className="flex flex-row gap-1 p-1 items-center justify-center">
            {/* Быстрый фильтр: Торговый центр */}
            <button
              type="button"
              onClick={handleTcClick}
              className={`${styles.tcButton} ${isTcActive ? styles.tcButtonActive : ''}`}
            >
              ТЦ
            </button>

            {/* Количество на странице */}
            <div className={styles.limitContainer} ref={limitRef}>
              <div
                className={styles.tooltipContainer}
                data-tooltip="Количество на странице"
              >
                <ListChecks
                  size={24}
                  onClick={toggleLimitOptions}
                  className={`${styles.icon} ${showLimitOptions ? styles.activeIcon : ''}`}
                />
              </div>

              {showLimitOptions && (
                <div className={styles.dropdown}>
                  {[24, 48, 72].map((limit) => (
                    <div
                      key={limit}
                      className={`${styles.dropdownItem} ${currentLimit === limit ? styles.active : ''}`}
                      onClick={() => handleLimitChange(limit)}
                    >
                      {limit}
                    </div>
                  ))}
                  <div
                    className={`${styles.dropdownItem} ${currentLimit === totalItems ? styles.active : ''}`}
                    onClick={() => handleLimitChange(totalItems)}
                  >
                    Все
                  </div>
                </div>
              )}
            </div>
          </div>
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