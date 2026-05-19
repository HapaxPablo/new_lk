import { useNomenclatureStore } from '@/store/useNomenclatureStore'
import { CardNomenclature } from '@/components/ui/card/CardNomenclature'
import styles from '@/app/(main)/order/OrderCreate.module.scss'
import { useOrderCreate } from '@/providers/order/OrderCreateContext'

export function PlacementsList() {
    const { ids, items } = useNomenclatureStore()
    const { order: { errors } } = useOrderCreate()

    const handleClick = (id: string) =>
        window.open(`/nomenclatures/${id}`, '_blank')

    return (
        <div className={styles.placements}>
            <div className={styles.placements__header}>
                <span className={styles.placements__label}>
                    Места размещения
                </span>
                {ids.length > 0 && (
                    <span className={styles.placements__count}>
                        Выбрано: {ids.length}
                    </span>
                )}
            </div>

            {errors.nomenclature_ids && (
                <p className={styles.placements__error}>
                    {errors.nomenclature_ids}
                </p>
            )}

            <div className={styles.placements__list}>
                {items.length === 0 ? (
                    <div className={styles.placements__empty}>
                        Нет выбранных мест размещения
                    </div>
                ) : (
                    items.map((item) => (
                        <CardNomenclature
                            key={item.id}
                            item={item}
                            onClick={() => handleClick(item.id)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}