'use client'

import { INomenclatureItem } from '@/types/nomenclature'
import dynamic from 'next/dynamic'
import { useMediaQuery } from 'usehooks-ts'
import { CardDesktop } from '../ui/card/desktop/CardDesktop'
import { CardMobile } from '../ui/card/mobile/CardMobile'
import Loading from '../ui/loading/Loading'

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
  {
    ssr: false,
    loading: () => (
      <CardMobile>
        <Loading />
      </CardMobile>
    ),
  }
)

const NomenclatureCardDesktop = dynamic(
  () =>
    import('./card/desktop/NomenclatureItemDesktop').then((mod) => ({
      default: mod.NomenclatureItemDesktop,
    })),
  {
    ssr: false,
    loading: () => (
      <CardDesktop>
        <Loading />
      </CardDesktop>
    ),
  }
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
