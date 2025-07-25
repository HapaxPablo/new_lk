'use client'

import { INomenclatureItem } from '@/types/nomenclature'
import dynamic from 'next/dynamic'
import { CardDesktop } from '../ui/card/desktop/CardDesktop'
import LoaderSkeleton from '../ui/loader/LoaderSkeleton'
import styles from './NomenclatureWrapper.module.scss'
interface NomenclatureCardProps {
  nomenclatureData: INomenclatureItem[]
  className?: string
  children?: React.ReactNode
}

const NomenclatureCardDesktop = dynamic(
  () =>
    import('./card/desktop/NomenclatureItemDesktop').then((mod) => ({
      default: mod.NomenclatureItemDesktop,
    })),
  {
    ssr: false,
    loading: () => (
      <CardDesktop>
        <LoaderSkeleton />
      </CardDesktop>
    ),
  }
)

export const NomenclatureWrapper = ({
  nomenclatureData,
}: NomenclatureCardProps) => {
  return (
    <div className={styles.gridWrapper}>
      <NomenclatureCardDesktop item={nomenclatureData} />
    </div>
  )
}
