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

    useEffect(() => {
        if (!loaderRef.current) return
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    setSize(size + 1)
                }
            },
            { threshold: 0.5 }
        )
        observer.observe(loaderRef.current)
        return () => observer.disconnect()
    }, [hasMore, isLoadingMore, size, setSize])

    if (isLoadingInitial) {
        return (
            <div className={styles.list}>
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
            <div className={styles.list}>
                {items.map((item) => (
                    <CardNomenclature key={item.id} item={item} onClick={() => handleRedirect(item.id)} />
                ))}
            </div>
            <div ref={loaderRef} className={styles.loader}>
                {isLoadingMore && <span>Загрузка...</span>}
            </div>
        </div>
    )
}