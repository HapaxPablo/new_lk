import { CardDesktop } from '@/components/ui/card/desktop/CardDesktop'
import { INomenclatureItem } from '@/types/nomenclature'
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
  const handleClickCard = (id: string, code1c: string) => {
    // Переход на страницу с расшифровкой
    router.push(`nomenclatures/${id}`)
  }

  return (
    <>
      {item.map((item, key) => (
        <CardDesktop
          onClick={() => handleClickCard(item.id, item.code1c)}
          key={key}
          className={`${className}`}
          item={item}
        />
      ))}
    </>
  )
}
