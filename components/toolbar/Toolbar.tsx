'use client'
import { useClickOutside } from '@/hooks/useClickOutside'
import { ArrowDownWideNarrow, ListChecks, Settings } from 'lucide-react'
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
  const [showSortOptions, setShowSortOptions] = useState<boolean>(false)
  const [showLimitOptions, setShowLimitOptions] = useState<boolean>(false)

  const sortRef = useRef<HTMLDivElement>(null)
  const limitRef = useRef<HTMLDivElement>(null)

  const anyDropdownOpen = showSortOptions || showLimitOptions

  useClickOutside(
    [sortRef, limitRef],
    () => {
      setShowSortOptions(false)
      setShowLimitOptions(false)
    },
    anyDropdownOpen
  )

  const handleLimitChange = (limit: number): void => {
    const params = new URLSearchParams(searchParams.toString())
    const currentPage = params.get('page')
    params.set('limit', limit.toString())
    params.set('page', currentPage!!)
    router.push(`${pathname}?${params.toString()}`)
    setShowLimitOptions(false)
  }

  const handleSortChange = (sortKey: string): void => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortKey)
    router.push(`${pathname}?${params.toString()}`)
    setShowSortOptions(false)
  }

  const toggleFilters = (): void => {
    setShowFilters(!showFilters)
    setShowSortOptions(false)
    setShowLimitOptions(false)
  }

  const toggleSortOptions = (): void => {
    setShowSortOptions(!showSortOptions)
    setShowLimitOptions(false)
  }

  const toggleLimitOptions = (): void => {
    setShowLimitOptions(!showLimitOptions)
    setShowSortOptions(false)
  }

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.mainPanel}>
          <div className={styles.totalItems}>Всего: {totalItems}</div>
          <SearchForm hideButton className={styles.searchForm} />

          {/* Кнопка фильтров всегда в тулбаре, но скрыта на десктопе через CSS */}
          <div className={styles.tooltipContainer} data-tooltip="Фильтры">
            <Settings
              size={24}
              onClick={toggleFilters}
              className={`${styles.icon} ${showFilters ? styles.activeIcon : ''}`}
            />
          </div>
          <div className="flex flex-row gap-1 p-1">
            {/* <div className={styles.sortContainer} ref={sortRef}>
              <div
                className={styles.tooltipContainer}
                data-tooltip="Сортировка"
              >
                <ArrowDownWideNarrow
                  size={24}
                  onClick={toggleSortOptions}
                  className={`${styles.icon} ${showSortOptions ? styles.activeIcon : ''}`}
                />
              </div>

              {showSortOptions && (
                <div className={styles.dropdown}>
                  <div
                    className={styles.dropdownItem}
                    onClick={() => handleSortChange('name')}
                  >
                    По названию
                  </div>
                  <div
                    className={styles.dropdownItem}
                    onClick={() => handleSortChange('address')}
                  >
                    По адресу
                  </div>
                  <div
                    className={styles.dropdownItem}
                    onClick={() => handleSortChange('brand')}
                  >
                    По бренду
                  </div>
                </div>
              )}
            </div> */}

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
                  <div
                    className={`${styles.dropdownItem} ${
                      currentLimit === 24 ? styles.active : ''
                    }`}
                    onClick={() => handleLimitChange(24)}
                  >
                    24
                  </div>
                  <div
                    className={`${styles.dropdownItem} ${
                      currentLimit === 48 ? styles.active : ''
                    }`}
                    onClick={() => handleLimitChange(48)}
                  >
                    48
                  </div>
                  <div
                    className={`${styles.dropdownItem} ${
                      currentLimit === 72 ? styles.active : ''
                    }`}
                    onClick={() => handleLimitChange(72)}
                  >
                    72
                  </div>
                  <div
                    className={`${styles.dropdownItem} ${
                      currentLimit === totalItems ? styles.active : ''
                    }`}
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
