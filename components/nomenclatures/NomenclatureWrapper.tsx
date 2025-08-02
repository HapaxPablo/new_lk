'use client'
import { INomenclatureItem } from '@/types/nomenclature'
import dynamic from 'next/dynamic'
import LoaderSkeleton from '../ui/loader/LoaderSkeleton'
import styles from './NomenclatureWrapper.module.scss'
interface NomenclatureCardProps {
  nomenclatureData: INomenclatureItem[]
  className?: string
  children?: React.ReactNode
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
}: NomenclatureCardProps) => {
    console.log('NomenclatureList length:', nomenclatureData)
  return (
    <div className={styles.gridWrapper}>
      <NomenclatureCards item={nomenclatureData} />
    </div>
  )
}
