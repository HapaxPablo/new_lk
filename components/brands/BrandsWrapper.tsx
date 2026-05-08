'use client'

import dynamic from 'next/dynamic'
import { useRef, useEffect } from 'react'
import FiltersPanel from '../panels/filter-panels/FiltersPanels'
import ScrollButton from '../ui/button/ScrollButton'
import LoaderSkeleton from '../ui/loader/LoaderSkeleton'
import styles from './BrandsWrapper.module.scss'
import { useBrands } from '@/hooks/useBrands'
import { IBrandListItem } from '@/types/brands'

const BrandCards = dynamic(
    () => import('./card/BrandItem').then((mod) => ({ default: mod.BrandItems })),
    { ssr: true, loading: () => <LoaderSkeleton /> }
)

interface BrandCardsProps {
    brandData: IBrandListItem[]
    className?: string
    children?: React.ReactNode
    limit?: number
    offset?: number
    count?: number
}

export const BrandsWrapper = ({ brandData, className, count, limit, offset }: BrandCardsProps) => {
    const cardsWrapperRef = useRef<HTMLDivElement>(null)
    const loaderRef = useRef<HTMLDivElement>(null)

    const {
        items,
        totalCount,
        hasMore,
        isLoadingInitial,
        isLoadingMore,
        size,
        setSize,
    } = useBrands({
        initialData: brandData,
        initialCount: count,
        limit: limit || 15,
        initialOffset: offset || 0,
    })

    useEffect(() => {
        if (!loaderRef.current || !cardsWrapperRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    setSize(size + 1)
                }
            },
            {
                root: cardsWrapperRef.current,  // ← Смотри в контейнере, а не в окне
                threshold: 0.1,
                rootMargin: '100px',  // ← Начинай загружать за 100px до конца
            }
        )
        observer.observe(loaderRef.current)
        return () => observer.disconnect()
    }, [hasMore, isLoadingMore, size, setSize, cardsWrapperRef])

    return (
        <div className={styles.displayWrapper}>

            <div className={styles.contentContainer}>
                <div ref={cardsWrapperRef} className={styles.cardsWrapper}>
                    {isLoadingInitial ? (
                        <LoaderSkeleton />
                    ) : items.length === 0 ? (
                        <p>Бренды не найдены</p>
                    ) : (
                        <BrandCards item={items} />
                    )}

                    <div ref={loaderRef}>
                        {isLoadingMore && <LoaderSkeleton />}
                    </div>

                    <ScrollButton
                        scrollContainerRef={cardsWrapperRef}
                        showAfterScroll={500}
                        position="bottom-right"
                        size="md"
                    />
                </div>
            </div>
        </div>
    )
}