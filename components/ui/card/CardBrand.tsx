import { ICounterparty } from '@/types/counterparty'
import { Building, Hash, Calendar } from 'lucide-react'
import styles from './CardBrand.module.scss'
import { Button } from '../button/Button'
import { useUniversalClick } from '@/hooks/useUniversalClick'
import { InfoRow } from '../InfoRow'
import { IBrandListItem } from '@/types/brands'
import Image from 'next/image'
import { LinkButton } from '../button/LinkButton'

interface CardBrandProps {
    className?: string
    onClick?: () => void
    item: IBrandListItem
}

export const CardBrand: React.FC<CardBrandProps> = ({
    item,
    className = '',
    onClick,
}) => {
    const handleUniversalClick = useUniversalClick()

    return (
        <article className={`${styles.card} ${className}`} onClick={onClick}>
            <div className={styles.cardContent}>
                <div className={styles.infoSection}>
                    <div className={styles.imageWrapper}>
                        {item.logotype ? (
                            <Image
                                src={item.logotype}
                                alt={`Бренд ${item.name || 'Бренд'}`}
                                fill
                                loading="lazy"

                                className={styles.image}
                            />
                        ) : (
                            <div className={styles.imagePlaceholder}>
                                <Image
                                    src="/og-logo.jpg"
                                    alt="Логотип"
                                    width={200}
                                    height={100}
                                    loading="lazy"

                                    className="object-contain"
                                />
                            </div>
                        )}
                    </div>
                    <InfoRow
                        icon={<Building size={16} />}
                        label=""
                        value={item.name ? item.name : '-'}
                        valueClassName={styles.nameText}
                    />
                </div>
            </div>

            <div className={styles.actionsSection}>
                {/* TODO: LinkButton подробнее href=brands/{item.slug} */}
                <LinkButton href={`brands/${item.slug}`} variant="default">
                    Подробнее
                </LinkButton>
                {/* <Button
                    className={styles.button}
                    variant="detail"
                    onClick={(e) => handleUniversalClick(onClick, e)}
                >
                    Подробнее
                </Button> */}
            </div>
        </article>
    )
}
