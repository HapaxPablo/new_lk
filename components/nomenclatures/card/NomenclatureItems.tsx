import { CardDesktop } from '@/components/ui/card/desktop/CardDesktop'
import { FieldValue } from '@/components/ui/fields/fieldValue/FieldValue'
import { INomenclatureItem } from '@/types/nomenclature'
import Image from 'next/image'
import styles from './NomenclatureItem.module.scss'
import { useRouter } from 'next/navigation'

interface NomenclatureCardProps {
  item: INomenclatureItem[]
  className?: string
}

export const NomenclatureItems: React.FC<NomenclatureCardProps> = ({
  item,
  className = '',
}) => {
  const router = useRouter()
  const handleClickCard = (article: string) => {
    // Переход на страницу с расшифровкой
    router.push(`nomenclatures/${article}`)
  }

  return (
    <>
      {item.map((item, key) => (
        <CardDesktop
          onClick={() => handleClickCard(item.article)}
          key={key}
          className={`${className}`}
          item={item}
        />
      ))}
    </>
  )
}
