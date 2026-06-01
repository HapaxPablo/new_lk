
import { useRouter } from 'next/navigation'
import styles from './BrandItem.module.scss'
import { CardBrand } from '@/components/ui/card/CardBrand'
import { IBrandListItem } from '@/types/brands'

interface BrandCardProps {
    item: IBrandListItem[]
    className?: string
}

export const BrandItems: React.FC<BrandCardProps> = ({
    item,
    className = '',
}) => {
    const router = useRouter()

    const handleClickCard = (slug: string) => {
        // router.push(`/brands/${slug}`)
    }

    return (
        <div className={styles.cardGrid}>
            {item.map((brand, key) => (
                <CardBrand
                    onClick={() => handleClickCard(brand.slug)}
                    key={key}
                    className={`${className}`}
                    item={brand}
                />
            ))}
        </div>
    )
}
