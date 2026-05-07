'use client'

import { INomenclatureItem } from '@/types/nomenclature'
import dynamic from 'next/dynamic'
import { Suspense, useCallback, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useInfiniteNomenclatures } from '@/hooks/useInfiniteNomenclatures'
import { useMediaQuery } from 'usehooks-ts'

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
export const NomenclatureWrapper = (props: NomenclatureCardProps) => {
  return (
    <Suspense fallback={<LoaderSkeleton />}>
      <NomenclatureWrapperContent {...props} />
    </Suspense>
  )
}
export const NomenclatureWrapperContent = ({
  nomenclatureData,
  limit,
  page,
  count,
}: NomenclatureCardProps) => {
  const cardsWrapperRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const {
    items,
    totalCount: hookTotalCount,
    hasMore,
    isLoadingMore,
    size,
    setSize,
  } = useInfiniteNomenclatures(nomenclatureData, count, page)

  const loadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      setSize((s) => s + 1)
    }
  }, [hasMore, isLoadingMore, setSize, size])

  // IntersectionObserver
  useEffect(() => {
    if (!hasMore || isLoadingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          loadMore()
        }
      },
      {
        root: cardsWrapperRef.current,
        rootMargin: '0px 0px 200px 0px',
        threshold: 0.1,
      }
    )

    const currentSentinel = sentinelRef.current
    if (currentSentinel) {
      observer.observe(currentSentinel)
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel)
      }
    }
  }, [loadMore, hasMore, isLoadingMore])

  // Scroll-based fallback
  useEffect(() => {
    if (!hasMore || isLoadingMore || !cardsWrapperRef.current) return

    const handleScroll = () => {
      const wrapper = cardsWrapperRef.current
      if (!wrapper) return

      const { scrollTop, scrollHeight, clientHeight } = wrapper
      const scrollPercent = (scrollTop + clientHeight) / scrollHeight

      if (scrollPercent >= 0.8) {
        if (hasMore && !isLoadingMore) {
          loadMore()
        }
      }
    }

    const currentWrapper = cardsWrapperRef.current
    currentWrapper.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      currentWrapper.removeEventListener('scroll', handleScroll)
    }
  }, [hasMore, isLoadingMore, loadMore])

  useEffect(() => {
    if (size > 1 && hasMore) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', String(size))
      router.replace(`?${params.toString()}`, { scroll: false })
    }
    // Обнулить page, если дошли до конца
    if (!hasMore && size > 1) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', String(size - 1)) // последняя валидная страница
      router.replace(`?${params.toString()}`, { scroll: false })
    }
  }, [size, hasMore])

  const displayItems = items.length > 0 ? items : nomenclatureData
  const displayTotal = hookTotalCount || count || 0

  return (
    <div className={styles.displayWrapper}>
      <div className={styles.contentContainer}>
        <div ref={cardsWrapperRef} className={styles.cardsWrapper}>
          {displayItems.length <= 0 ? (
            <div className={styles.emptyState}>
              <p>Места размещения не найдены</p>
            </div>
          ) : (
            <NomenclatureCards item={displayItems} />
          )}

          <div
            ref={sentinelRef}
            className={styles.sentinel}
            aria-hidden="true"
          />

          {isLoadingMore && (
            <div className={styles.loadingMore}>
              <LoaderSkeleton />
              <span className={styles.loadingText}>
                Загрузка дополнительных мест...
              </span>
            </div>
          )}

          <div className={styles.paginationContainer}>
            <Pagination
              limit={limit ?? 24}
              page={size}
              total={displayTotal}
              infiniteScroll={true}
              showPageNumbers={false}
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