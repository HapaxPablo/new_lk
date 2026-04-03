'use client'

import { ITenantsListItem, ITenantsResponse } from '@/types/nomenclature'
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'
import { useInfinityTenants } from '@/hooks/useInfinityTenants'
import { SearchForm } from '@/components/search-form/SearchForm'
import { useDebounce } from '@/hooks/useDebounce'
// import { FloorSelect } from '@/components/ui/select/FloorSelect'

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

  console.log('🚀 items:', items)

  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setSize(prev => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) observer.observe(loaderRef.current)

    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, setSize])

  useEffect(() => {
    setSize(1)
  }, [debouncedSearch, floor, setSize])

  if (isLoadingInitial) return <p>Загрузка...</p>

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Поиск арендатора..."
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        {/* <FloorSelect
          options={floors}
          value={floor}
          onChange={setFloor}
        /> */}
      </div>

      {!items.length ? (
        <p>Арендаторы не найдены</p>
      ) : (
        <ul className="overflow-auto max-h-96 pr-2">
          {items.map((tenant, index) => (
            <li
              key={`${tenant.id}-${tenant.floor}-${index}`}
              className="flex items-center mb-2 flex-row"
            >
              <TenantLogo tenant={tenant} />
              {tenant.brands_list}
            </li>
          ))}
          <div ref={loaderRef} className="py-2 text-center">
            {isLoadingMore && <p>Загрузка...</p>}
          </div>
        </ul>
      )}
    </div>
  )
}