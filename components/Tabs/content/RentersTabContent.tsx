'use client'

import { ITenantsListItem, ITenantsResponse } from '@/types/nomenclature'
import Image from 'next/image'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useInfinityTenants } from '@/hooks/useInfinityTenants'
import { SearchForm } from '@/components/search-form/SearchForm'
import { useDebounce } from '@/hooks/useDebounce'
import { Select } from '@/components/ui/select/Select'
import styles from './styles/RentersTab.module.scss'
import SearchClient from '@/components/ui/searchClient/SearchClient'

interface RentersTabContentProps {
  nomenclatureId: string
  initialTenantsData?: ITenantsResponse | null
}

const TenantLogo = ({ tenant }: { tenant: ITenantsListItem }) => {
  const [hasError, setHasError] = useState(false)
  const [shouldRender] = useState(tenant.logotype && tenant.logotype.length > 0)

  if (!shouldRender || hasError) return null

  return (
    <Image
      src={tenant.logotype}
      alt={`${tenant.brands_list} логотип`}
      width={120}
      height={120}
      className="object-contain mr-2"
      onError={() => setHasError(true)}
    />
  )
}

export const RentersTabContent = ({ nomenclatureId, initialTenantsData }: RentersTabContentProps) => {
  const [inputValue, setInputValue] = useState('')
  const [floor, setFloor] = useState('')

  const debouncedSearch = useDebounce(inputValue, 500)

  const { items, hasMore, isLoadingInitial, isLoadingMore, setSize, size, floors } =
    useInfinityTenants(nomenclatureId, debouncedSearch, floor, initialTenantsData)

  const loaderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLUListElement>(null)

  // Observer для бесконечного скролла
  useEffect(() => {
    const loader = loaderRef.current
    const container = containerRef.current

    if (!loader || !container) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          console.log('Loading more...', { hasMore, isLoadingMore })
          setSize(prev => prev + 1)
        }
      },
      {
        threshold: 0.1,
        root: container, // container должен быть scrollable parent
        rootMargin: '0px 0px 100px 0px', // Добавляем отступ для упреждающей загрузки
      }
    )

    observer.observe(loader)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, setSize]) // Убираем items из зависимостей

  // Сброс пагинации при изменении поиска или этажа
  useEffect(() => {
    if (size !== 1) {
      setSize(1)
    }
  }, [debouncedSearch, floor, setSize])

  if (isLoadingInitial) return <p>Загрузка...</p>

  return (
    <div>
      <div className={styles.filterWrapper}>
        <SearchClient
          value={inputValue}
          onChange={(e: any) => setInputValue(e.target.value)}
          placeholder="Поиск арендатора..."
          type='text'
        />
        <Select
          options={floors}
          value={floor}
          onChange={setFloor}
          placeholder="Этаж"
        />
      </div>

      {!items.length && !isLoadingInitial ? (
        <p>Арендаторы не найдены</p>
      ) : (
        <ul
          ref={containerRef}
          className='overflow-auto h-96'
          style={{ overflowAnchor: 'none' }}
        >
          {items.map((tenant, index) => (
            <li
              key={`${tenant.id}-${tenant.floor}-${index}`}
              className="flex items-center mb-2 flex-row p-2 border-b"
            >
              <TenantLogo tenant={tenant} />
              <span>{tenant.brands_list}</span>
            </li>
          ))}
          <div ref={loaderRef} className="py-2 text-center">
            {isLoadingMore && <p>Загрузка ещё...</p>}
            {!hasMore && items.length > 0 && <p>Все арендаторы загружены</p>}
          </div>
        </ul>
      )}
    </div>
  )
}