'use client'

import { INomenclatureItem } from '@/types/nomenclature'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { Pagination } from '../pagination/Pagination'
import FiltersPanel from '../panels/filter-panels/FiltersPanels'
import ScrollButton from '../ui/button/ScrollButton'
import LoaderSkeleton from '../ui/loader/LoaderSkeleton'
import styles from './NomenclatureWrapper.module.scss'

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

  return (
    <div className={styles.displayWrapper}>
      <div className={styles.filtersContainer}>
        <FiltersPanel />
      </div>

      <div className={styles.contentContainer}>
        <div ref={cardsWrapperRef} className={styles.cardsWrapper}>
          {nomenclatureData.length <= 0 ? (
            'Места размещения не найдены'
          ) : (
            <NomenclatureCards item={nomenclatureData} />
          )}

          {nomenclatureData.length > 20 && (
            <div className={styles.paginationContainer}>
              <Pagination limit={limit!!} page={page!!} total={count!!} />
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
