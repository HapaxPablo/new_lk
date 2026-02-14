'use client'

import { IPromotionList } from '@/types/promotion'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import FiltersPanel from '../panels/filter-panels/FiltersPanels'
import ScrollButton from '../ui/button/ScrollButton'
import LoaderSkeleton from '../ui/loader/LoaderSkeleton'
import styles from './PromotionsWrapper.module.scss'

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

interface PromotionsWrapperProps {
  promotionsData: IPromotionList[]
  className?: string
  children?: React.ReactNode
  limit?: number
  page?: number
  count?: number
}

const PromotionCards = dynamic(
  () =>
    import('./card/PromotionItems').then((mod) => ({
      default: mod.PromotionItems,
    })),
  {
    ssr: true,
    loading: () => <LoaderSkeleton />,
  }
)

export const PromotionsWrapper = ({
  promotionsData,
  limit,
  page,
  count,
}: PromotionsWrapperProps) => {
  const cardsWrapperRef = useRef<HTMLDivElement>(null)

  return (
    <div className={styles.displayWrapper}>
      <div className={styles.filtersContainer}>
        <FiltersPanel />
      </div>

      <div className={styles.contentContainer}>
        <div ref={cardsWrapperRef} className={styles.cardsWrapper}>
          {promotionsData.length <= 0 ? (
            'Акции не найдены'
          ) : (
            <PromotionCards item={promotionsData} />
          )}

          {page !== undefined && page >= 1 && (
            <div className={styles.paginationContainer}>
              <Pagination
                limit={limit ?? 150}
                page={page}
                total={count ?? 0}
                showPageNumbers={true}
              />
            </div>
          )}

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
