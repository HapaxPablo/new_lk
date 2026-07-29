'use client'

import { ICounterparty } from '@/types/counterparty'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import FiltersPanel from '../panels/filter-panels/FiltersPanels'
import ScrollButton from '../ui/button/ScrollButton'
import { ListWrapper } from '@/components/ui/list/ListWrapper'
import LoaderSkeleton from '../ui/loader/LoaderSkeleton'
import styles from './CounterpartiesWrapper.module.scss'

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

interface CounterpartiesWrapperProps {
  counterpartiesData: ICounterparty[]
  className?: string
  children?: React.ReactNode
  limit?: number
  page?: number
  count?: number
}

const CounterpartyCards = dynamic(
  () =>
    import('./card/CounterpartyItems').then((mod) => ({
      default: mod.CounterpartyItems,
    })),
  {
    ssr: true,
    loading: () => <LoaderSkeleton />,
  }
)

export const CounterpartiesWrapper = ({
  counterpartiesData,
  limit,
  page,
  count,
}: CounterpartiesWrapperProps) => {
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
      {counterpartiesData.length <= 0 ? (
        'Контрагенты не найдены'
      ) : (
        <CounterpartyCards item={counterpartiesData} />
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

