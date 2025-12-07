import { CardNomenclature } from '@/components/ui/card/CardNomenclature'
import { INomenclatureItem } from '@/types/nomenclature'
import { useRouter } from 'next/navigation'
import styles from './NomenclatureItem.module.scss'
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
    <div className={styles.cardGrid}>
      {item.map((item, key) => (
        <CardNomenclature
          onClick={() => handleClickCard(item.id, item.code1c)}
          key={key}
          className={`${className}`}
          item={item}
        />
      ))}
    </div>
  )
}
