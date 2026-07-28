'use client'

import { IPromotionList } from '@/types/promotion'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import FiltersPanel from '../panels/filter-panels/FiltersPanels'
import ScrollButton from '../ui/button/ScrollButton'
import { ListWrapper } from '@/components/ui/list/ListWrapper'
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
    <ListWrapper
      filters={<FiltersPanel />}
      pagination={
        page !== undefined && page >= 1 ? (
          <Pagination
            limit={limit ?? 150}
            page={page}
            total={count ?? 0}
            showPageNumbers={true}
          />
        ) : undefined
      }
      cardsWrapperRef={cardsWrapperRef}
      className={styles.displayWrapper}
      contentClassName={styles.contentContainer}
      cardsWrapperClassName={styles.cardsWrapper}
    >
      {promotionsData.length <= 0 ? (
        'Акции не найдены'
      ) : (
        <PromotionCards item={promotionsData} />
      )}

      <ScrollButton
        scrollContainerRef={cardsWrapperRef}
        showAfterScroll={500}
        position="bottom-right"
        size="md"
      />
    </ListWrapper>
  )
}
