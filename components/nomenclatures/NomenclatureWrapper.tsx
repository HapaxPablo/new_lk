'use client'

import { INomenclatureItem } from '@/types/nomenclature'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useInfiniteNomenclatures } from '@/hooks/useInfiniteNomenclatures'
import { useMediaQuery } from 'usehooks-ts'

// import { Pagination } from '../pagination/Pagination'
import FiltersPanel from '../panels/filter-panels/FiltersPanels'
import ScrollButton from '../ui/button/ScrollButton'
import LoaderSkeleton from '../ui/loader/LoaderSkeleton'
import styles from './NomenclatureWrapper.module.scss'

const Pagination = dynamic(
  () =>
    import('../pagination/Pagination').then((mod) => ({
      default: mod.Pagination,
    })),
  {
    ssr: false,
    loading: () => <LoaderSkeleton />,
  }
)
interface NomenclatureCardProps {
  nomenclatureData: INomenclatureItem[]
  className?: string
  children?: React.ReactNode
  limit?: number
  page?: number
  count?: number
}

const NomenclatureCards = dynamic(
  () =>
    import('./card/NomenclatureItems').then((mod) => ({
      default: mod.NomenclatureItems,
    })),
  {
    ssr: true,
    loading: () => <LoaderSkeleton />,
  }
)

export const NomenclatureWrapper = ({
  nomenclatureData,
  limit,
  page,
  count,
}: NomenclatureCardProps) => {
  const cardsWrapperRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { items, totalCount, hasMore, isLoadingMore, size, setSize } =
    useInfiniteNomenclatures(nomenclatureData)

  const loadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      setSize((s) => s + 1)
    }
  }, [hasMore, isLoadingMore, setSize])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && loadMore(),
      {
        root: cardsWrapperRef.current,
        threshold: 0,
      }
    )
    const currentSentinel = sentinelRef.current
    if (currentSentinel) observer.observe(currentSentinel)
    return () => observer.disconnect()
  }, [loadMore, isMobile])

  useEffect(() => {
    if (size > 0) {
      router.replace(`?page=${size}`, { scroll: false })
    }
  }, [size, router])

  // console.log('NOMENCLATURE', nomenclatureData);

  return (
    <div className={styles.displayWrapper}>
      {/* <div className={styles.filtersContainer}>
        <FiltersPanel />
      </div> */}

      <div className={styles.contentContainer}>
        <div ref={cardsWrapperRef} className={styles.cardsWrapper}>
          {(items.length > 0 ? items : nomenclatureData).length <= 0 ? (
            'Места размещения не найдены'
          ) : (
            <NomenclatureCards
              item={items.length > 0 ? items : nomenclatureData}
            />
          )}

          <div
            ref={sentinelRef}
            style={{ height: '50px', minHeight: '50px' }}
            aria-hidden="true"
          />

          {isLoadingMore && (
            <div className={styles.loadingMore}>
              <LoaderSkeleton />
            </div>
          )}

          <div className={styles.paginationContainer}>
            <Pagination
              limit={limit ?? 24}
              page={size}
              total={totalCount || count || 0}
              infiniteScroll={true}
              showPageNumbers={true}
            />
          </div>

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
