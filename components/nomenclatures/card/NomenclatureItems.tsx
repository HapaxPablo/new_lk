import { CardNomenclature } from '@/components/ui/card/CardNomenclature'
import { INomenclatureItem } from '@/types/nomenclature'
import { useRouter } from 'next/navigation'
import styles from './NomenclatureItem.module.scss'
import { trackSelectItem } from '@/lib/ecommerce/ecommerceHelpers'

//Чисто проверка

interface NomenclatureCardProps {
  item: INomenclatureItem[]
  className?: string
}

export const NomenclatureItems: React.FC<NomenclatureCardProps> = ({
  item,
  className = '',
}) => {
  const router = useRouter()
  const handleClickCard = (nomenclature: INomenclatureItem) => {
    // Отслеживаем клик в Яндекс.Метрику
    trackSelectItem(
      {
        item_id: nomenclature.id,
        item_name: nomenclature.nameForFront,
        item_category: nomenclature.typeOfPlace,
        item_brand: nomenclature.brand?.name,
        price: nomenclature.pricePerMonth,
      },
      'Список номенклатур'
    )

    // Переход на страницу с расшифровкой
    router.push(`/nomenclatures/${nomenclature.id}`)
  }

  return (
    <div className={styles.cardGrid}>
      {item.map((item, key) => (
        <CardNomenclature
          onClick={() => handleClickCard(item)}
          key={`${item.id} - ${item.code1c}`}
          className={`${className}`}
          item={item}
        />
      ))}
    </div>
  )
}
