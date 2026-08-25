'use client'

import { INomenclatureItem } from '@/types/nomenclature'
import dynamic from 'next/dynamic'
import { Suspense, useCallback, useEffect, useRef } from 'react'
import { useInfiniteNomenclatures } from '@/hooks/useInfiniteNomenclatures'

import ScrollButton from '../ui/button/ScrollButton'
import LoaderSkeleton from '../ui/loader/LoaderSkeleton'
import styles from './NomenclatureWrapper.module.scss'
import { SelectAllButton } from './select-all-button/SelectAllButton'

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

  const {
    items,
    totalCount: hookTotalCount,
    error,
    hasMore,
    isLoadingInitial,
    isLoadingMore,
    mutate,
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

  const displayItems = items
  const displayTotal = hookTotalCount || count || 0

  return (
    <div className={styles.displayWrapper}>
      {/* Хедер остаётся за пределами прокручиваемого списка. */}
      {displayItems.length > 0 && (
        <div className={styles.header}>
          <div>Всего найдено: {displayTotal}</div>
          <SelectAllButton items={displayItems} />
        </div>
      )}

      <div ref={cardsWrapperRef} className={styles.cardsWrapper}>
        {isLoadingInitial && displayItems.length === 0 ? (
          <LoaderSkeleton />
        ) : error && displayItems.length === 0 ? (
          <div className={styles.errorState} role="alert">
            <p>Не удалось загрузить места размещения.</p>
            <button type="button" onClick={() => mutate()}>
              Повторить
            </button>
          </div>
        ) : displayItems.length <= 0 ? (
          <div className={styles.emptyState}>
            <p>Места размещения не найдены</p>
          </div>
        ) : (
          <NomenclatureCards item={displayItems} />
        )}

        {error && displayItems.length > 0 && (
          <div className={styles.errorState} role="alert">
            <p>Не удалось обновить список мест.</p>
            <button type="button" onClick={() => mutate()}>
              Повторить
            </button>
          </div>
        )}

        <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

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
  )
}
