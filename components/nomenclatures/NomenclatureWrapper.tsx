'use client'

import { INomenclatureItem } from '@/types/nomenclature'
import dynamic from 'next/dynamic'
import { useMediaQuery } from 'usehooks-ts'

interface NomenclatureCardProps {
  item: INomenclatureItem
  className?: string
  children?: React.ReactNode
}

const NomenclatureCardMobile = dynamic(
  () =>
    import('./card/mobile/CardMobile').then((mod) => ({
      default: mod.CardMobile,
    })),
  { ssr: false, loading: () => <div>Loading...</div> }
)

const NomenclatureCardDesktop = dynamic(
  () =>
    import('./card/desktop/CardDesktop').then((mod) => ({
      default: mod.CardDesktop,
    })),
  { ssr: false, loading: () => <div>Loading...</div> }
)

export const NomenclatureWrapper = ({ item }: NomenclatureCardProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <>
      {isDesktop ? (
        <NomenclatureCardDesktop />
      ) : (
        <NomenclatureCardMobile item={item} />
      )}
    </>
  )
}
