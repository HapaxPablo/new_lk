'use client'

import Script from 'next/script'

export interface BreadcrumbItem {
    name: string
    url: string
}

interface BreadcrumbJsonLdProps {
    items: BreadcrumbItem[]
}

/**
 * Компонент для вставки BreadcrumbList JSON-LD структурированных данных
 * Используется для навигационной цепи (хлебные крошки)
 *
 * @example
 * <BreadcrumbJsonLd items={[
 *   { name: 'Главная', url: 'https://example.com' },
 *   { name: 'Номенклатуры', url: 'https://example.com/nomenclatures' },
 *   { name: 'Продукт', url: 'https://example.com/nomenclatures/123' }
 * ]} />
 */
export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
    if (!items || items.length === 0) {
        return null
    }

    const breadcrumbList = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    }

    return (
        <Script
            id="breadcrumb-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(breadcrumbList),
            }}
        />
    )
}
