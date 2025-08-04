'use client'
//TODO доработать параметры выпадающих списков по каким критериям нужно выполнять сортировки
import { useState, useEffect, useRef } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button/Button'
import { ArrowDownWideNarrow, ListChecks, Settings } from 'lucide-react'
import styles from './Toolbar.module.scss'

interface ToolbarProps {
  totalItems: number
  currentLimit: number
}

const Toolbar = ({ totalItems, currentLimit }: ToolbarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [showSortOptions, setShowSortOptions] = useState(false)
  const [showLimitOptions, setShowLimitOptions] = useState(false)

  console.log(currentLimit)

  // Refs для элементов
  const toolbarRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)
  const limitRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)

  // Обработчик клика вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortOptions(false)
      }
      if (
        limitRef.current &&
        !limitRef.current.contains(event.target as Node)
      ) {
        setShowLimitOptions(false)
      }
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLimitChange = (limit: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('limit', limit.toString())
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
    setShowLimitOptions(false)
  }

  const handleSortChange = (sortKey: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortKey)
    router.push(`${pathname}?${params.toString()}`)
    setShowSortOptions(false)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
    // Закрываем другие меню при открытии фильтров
    setShowSortOptions(false)
    setShowLimitOptions(false)
  }

  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions)
    // Закрываем другие меню при открытии сортировки
    setShowFilters(false)
    setShowLimitOptions(false)
  }

  const toggleLimitOptions = () => {
    setShowLimitOptions(!showLimitOptions)
    // Закрываем другие меню при открытии лимита
    setShowFilters(false)
    setShowSortOptions(false)
  }

  return (
    <div className={styles.toolbar} ref={toolbarRef}>
      <div className={styles.mainPanel}>
        {/* Общее количество */}
        <div className={styles.totalItems}>Всего: {totalItems}</div>

        {/* Кнопка настроек/фильтров */}
        <div
          className={styles.tooltipContainer}
          data-tooltip="Фильтры"
          ref={filtersRef}
        >
          <Settings
            size={24}
            onClick={toggleFilters}
            className={`${styles.icon} ${showFilters ? styles.activeIcon : ''}`}
          />
        </div>

        {/* Сортировка */}
        <div className={styles.sortContainer} ref={sortRef}>
          <div className={styles.tooltipContainer} data-tooltip="Сортировка">
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
        </div>

        {/* Выбор количества элементов */}
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

      {/* Фильтры */}
      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filterGroup}>
            <Button variant="default" onClick={() => handleSortChange('brand')}>
              По бренду
            </Button>
            <Button
              variant="default"
              onClick={() => handleSortChange('address')}
            >
              По адресу
            </Button>
            <Button
              variant="default"
              onClick={() => handleSortChange('article')}
            >
              По артикулу
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Toolbar
