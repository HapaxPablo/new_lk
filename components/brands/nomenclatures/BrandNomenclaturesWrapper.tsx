'use client'

import { useRef, useEffect } from 'react'
import { useBrandNomenclatures } from '@/hooks/useBrandNomenclatures'
import styles from './BrandNomenclaturesWrapper.module.scss'
import { CardNomenclature } from '@/components/ui/card/CardNomenclature'

interface Props {
    brandId: string
}

export const BrandNomenclatures = ({ brandId }: Props) => {
    const { items, totalCount, hasMore, isLoadingInitial, isLoadingMore, setSize, size } =
        useBrandNomenclatures(brandId)
    const loaderRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const loader = loaderRef.current
        if (!loader) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    setSize((s) => s + 1)  // функциональный апдейт
                }
            },
            {
                root: null,       // viewport (убрали listRef)
                threshold: 0.1,
            }
        )
        observer.observe(loader)
        return () => observer.disconnect()
    }, [hasMore, isLoadingMore, setSize])  // size убрали из deps

    if (isLoadingInitial) {
        return (
            <div className={styles.list} ref={listRef}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={styles.skeleton} />
                ))}
            </div>
        )
    }

    if (!items.length) {
        return <p className={styles.empty}>Номенклатуры не найдены</p>
    }

    const handleRedirect = (id: string) => {
        window.open(`/nomenclatures/${id}`, '_blank');
    }

    return (
        <div className={styles.wrapper}>
            <p className={styles.count}>Всего: {totalCount}</p>
            <div className={styles.list} ref={listRef}>
                {items.map((item) => (
                    <CardNomenclature key={item.id} item={item} onClick={() => handleRedirect(item.id)} />
                ))}
                <div ref={loaderRef} className={styles.loader}>
                    {isLoadingMore && <span>Загрузка...</span>}
                </div>
            </div>
        </div>
    )
}