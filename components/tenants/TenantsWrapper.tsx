'use client'

import { useGroupedTenants } from '@/hooks/useGroupedTenants'
import { IGroupedTenant } from '@/types/tenants'
import { useEffect, useRef } from 'react'
import ScrollButton from '../ui/button/ScrollButton'
import LoaderSkeleton from '../ui/loader/LoaderSkeleton'
import { TenantItems } from './card/TenantItems'
import styles from './TenantsWrapper.module.scss'

interface TenantsWrapperProps {
  tenantsData: IGroupedTenant[]
  limit?: number
  count?: number
}

export const TenantsWrapper = ({
  tenantsData,
  limit,
  count,
}: TenantsWrapperProps) => {
  const cardsWrapperRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)

  const { items, hasMore, isLoadingInitial, isLoadingMore, size, setSize } =
    useGroupedTenants({
      initialData: tenantsData,
      initialCount: count,
      limit: limit || 15,
    })

  useEffect(() => {
    if (!loaderRef.current || !cardsWrapperRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setSize(size + 1)
        }
      },
      {
        root: cardsWrapperRef.current,
        threshold: 0.1,
        rootMargin: '100px',
      }
    )

    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, size, setSize])

  return (
    <div className={styles.displayWrapper}>
      <div className={styles.contentContainer}>
        <div ref={cardsWrapperRef} className={styles.cardsWrapper}>
          {isLoadingInitial ? (
            <LoaderSkeleton />
          ) : items.length === 0 ? (
            <p className={styles.emptyText}>Арендаторы не найдены</p>
          ) : (
            <TenantItems item={items} />
          )}

          <div ref={loaderRef}>{isLoadingMore && <LoaderSkeleton />}</div>

          <ScrollButton
            scrollContainerRef={cardsWrapperRef}
            showAfterScroll={500}
            position="bottom-right"
            size="md"
          />
        </div>
      </div>
    </div>
  )
}
