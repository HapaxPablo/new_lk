'use client'

import { INomenclatureItem } from '@/types/nomenclature'
import dynamic from 'next/dynamic'
import { useMediaQuery } from 'usehooks-ts'
import { Loader } from '../ui/loader/Loader'

interface NomenclatureCardProps {
  nomenclatureData: INomenclatureItem[]
  className?: string
  children?: React.ReactNode
}

const NomenclatureCardMobile = dynamic(
  () =>
    import('./card/mobile/NomenclatureItemMobile').then((mod) => ({
      default: mod.NomenclatureItemMobile,
    })),
  { ssr: false, loading: () => <Loader /> }
)

const NomenclatureCardDesktop = dynamic(
  () =>
    import('./card/desktop/NomenclatureItemDesktop').then((mod) => ({
      default: mod.NomenclatureItemDesktop,
    })),
  { ssr: false, loading: () => <Loader /> }
)

export const NomenclatureWrapper = ({
  nomenclatureData,
}: NomenclatureCardProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <>
      {isDesktop ? (
        <>
          {nomenclatureData.map((item, key) => (
            <NomenclatureCardDesktop item={item} key={key} />
          ))}
        </>
      ) : (
        <>
          {nomenclatureData.map((item, key) => (
            <NomenclatureCardMobile item={item} key={key} />
          ))}
        </>
      )}
    </>
  )
}
