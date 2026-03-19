'use client'

import { INomenclatureItem } from '@/types/nomenclature'
import dynamic from 'next/dynamic'
import { Suspense, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
  console.log('🔍 NomenclatureWrapper render START', {
    hasNomenclatureData: !!nomenclatureData,
    nomenclatureDataLength: nomenclatureData?.length,
    page,
    count,
    timestamp: Date.now(),
  })
  const cardsWrapperRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 768px)')
  console.log('🔍 Before useInfiniteNomenclatures hook')

  const {
    items,
    totalCount: hookTotalCount,
    hasMore,
    isLoadingMore,
    size,
    setSize,
  } = useInfiniteNomenclatures(nomenclatureData, count, page)
  console.log('🔍 After useInfiniteNomenclatures hook', {
    itemsLength: items?.length,
    hasMore,
    isLoadingMore,
    size,
  })
  const loadMore = useCallback(() => {
    console.log('📜 Load more clicked:', { size, hasMore, isLoadingMore })
    if (hasMore && !isLoadingMore) {
      setSize((s) => s + 1)
    }
  }, [hasMore, isLoadingMore, setSize, size])

  // Исправленный IntersectionObserver
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
        root: cardsWrapperRef.current, // Используем контейнер вместо viewport
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

  // Добавляем запасной вариант с scroll событием
  useEffect(() => {
    if (!hasMore || isLoadingMore || !cardsWrapperRef.current) return

    const handleScroll = () => {
      const wrapper = cardsWrapperRef.current
      if (!wrapper) return

      const { scrollTop, scrollHeight, clientHeight } = wrapper
      const scrollPercent = (scrollTop + clientHeight) / scrollHeight

      // Триггер при достижении 80% высоты
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

  // Обновляем URL при изменении страницы
  useEffect(() => {
    if (size > 0) {
      router.replace(`?page=${size}`, { scroll: false })
    }
  }, [size, router])

  // Определяем, какие данные показывать
  const displayItems = items.length > 0 ? items : nomenclatureData
  const displayTotal = hookTotalCount || count || 0
  console.log('🔍 NomenclatureWrapper render END')
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

          {/* для бесконечной прокрутки */}
          <div
            ref={sentinelRef}
            className={styles.sentinel}
            aria-hidden="true"
          />

          {/* Индикатор загрузки */}
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

          {/* Кнопка прокрутки вверх/вниз */}
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
