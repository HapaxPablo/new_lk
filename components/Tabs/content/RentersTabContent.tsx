'use client'

import { ITenantsListItem, ITenantsResponse } from '@/types/nomenclature'
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'
import { useInfinityTenants } from '@/hooks/useInfinityTenants'
import { useDebounce } from '@/hooks/useDebounce'
import { Select } from '@/components/ui/select/Select'
import styles from './styles/RentersTab.module.scss'
import SearchClient from '@/components/ui/searchClient/SearchClient'
import { UserMinus } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider/AuthProvider'

interface RentersTabContentProps {
  nomenclatureId: string
  initialTenantsData?: ITenantsResponse | null
}

const TenantLogo = ({ tenant }: { tenant: ITenantsListItem }) => {
  const [hasError, setHasError] = useState(false)
  const shouldRender = tenant.logotype && tenant.logotype.length > 0

  if (!shouldRender || hasError) {
    const initials = tenant.brands_list
      ? tenant.brands_list.slice(0, 2).toUpperCase()
      : '?'

    return (
      <div className={styles.tenantAvatarFallback}>
        <span>{initials}</span>
      </div>
    )
  }

  return (
    <div className={styles.tenantLogoWrapper}>
      <Image
        src={tenant.logotype}
        alt={tenant.brands_list}
        width={40}
        height={40}
        className={styles.tenantLogo}
        onError={() => setHasError(true)}
      />
    </div>
  )
}

const SkeletonRow = () => (
  <div className={styles.skeletonRow}>
    <div className={styles.colIndex}>
      <div className={styles.skeletonIndex} />
    </div>

    <div className={styles.colMain}>
      <div className={styles.skeletonAvatar} />
      <div className={styles.skeletonTitle} />
    </div>

    <div className={styles.colFloor}>
      <div className={styles.skeletonSub} />
    </div>
  </div>
)

export const RentersTabContent = ({
  nomenclatureId,
  initialTenantsData,
}: RentersTabContentProps) => {
  const { isEmployee } = useAuth()
  const [inputValue, setInputValue] = useState('')
  const [floor, setFloor] = useState('')
  const [hovered, setHovered] = useState<string | null>(null)

  const debouncedSearch = useDebounce(inputValue, 500)

  const {
    items,
    hasMore,
    isLoadingInitial,
    isLoadingMore,
    setSize,
    size,
    floors,
    mutate
  } = useInfinityTenants(nomenclatureId, debouncedSearch, floor, initialTenantsData)

  const loaderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClickDelete = async (tenantId: string) => {
    try {
      const res = await fetch(
        `/api/nomenclatures/${nomenclatureId}/tenant/${tenantId}/`,
        { method: 'DELETE', credentials: 'include' }
      )

      if (res.status === 401) {
        window.location.href = '/login'
        return
      }

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || data.message)
      }

      await mutate()
    } catch (e) {
      console.error('CLIENT ERROR:', e)
    }
  }

  useEffect(() => {
    const loader = loaderRef.current
    const container = containerRef.current
    if (!loader || !container) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setSize(prev => prev + 1)
        }
      },
      { threshold: 0.1, root: container, rootMargin: '0px 0px 100px 0px' }
    )

    observer.observe(loader)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, setSize])

  useEffect(() => {
    if (size !== 1) setSize(1)
  }, [debouncedSearch, floor, setSize])

  return (
    <div className={styles.root}>
      {/* Фильтры */}
      <div className={styles.filterBar}>
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
            placeholder="Выбрать этаж"
          />
        </div>


      </div>

      {/* СПИСОК */}
      <div className={styles.tableWrapper}>
        <div className={styles.list}>
          {/* header */}
          <div className={styles.header}>
            <div className='flex justify-center items-center'>#</div>
            <div className='flex justify-center items-center'>Арендатор</div>
            {!floor && <div className='flex justify-center items-center'>Этаж</div>}
          </div>

          {/* body */}
          <div className={styles.body} ref={containerRef}>
            {isLoadingInitial ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            ) : !items.length ? (
              <div className={styles.emptyState}>
                <p>Арендаторы не найдены</p>
              </div>
            ) : (
              items.map((tenant, index) => (
                <div
                  key={`${tenant.id}-${index}`}
                  className={styles.row}
                  onMouseEnter={() => setHovered(tenant.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className={styles.colIndex}>
                    {hovered === tenant.id && isEmployee
                      ? <UserMinus size={20}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleClickDelete(tenant.id)
                        }}
                      />
                      : index + 1}
                  </div>

                  <div className={styles.colMain}>
                    <TenantLogo tenant={tenant} />
                    <span className={styles.tenantName}>
                      {tenant.brands_list}
                    </span>
                  </div>

                  {!floor && (
                    <div className={styles.colFloor}>
                      {tenant.floor && (
                        <span className={styles.floorBadge}>
                          {tenant.floor}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

            {/* loader */}
            <div ref={loaderRef} className={styles.loaderAnchor}>
              {isLoadingMore && <div className={styles.spinner} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}