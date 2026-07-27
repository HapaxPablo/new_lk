'use client'

import { useEffect } from 'react'
import { trackViewItem, type EcommerceItem } from '@/lib/ecommerce/ecommerceHelpers'

interface EcommerceTrackerProps {
    item: EcommerceItem
}

/**
 * Клиентский компонент для отслеживания просмотра товара
 * Добавьте в SSR страницы номенклатур
 *
 * @example
 * export default async function NomenclaturePage({ params }: PageProps) {
 *   const nomenclature = await fetchNomenclature(params.id)
 *   return (
 *     <>
 *       <EcommerceTracker
 *         item={{
 *           item_id: params.id,
 *           item_name: nomenclature.nameForFront,
 *           item_category: nomenclature.typeOfPlace,
 *           item_brand: nomenclature.brand?.name,
 *           price: nomenclature.pricePerMonth,
 *         }}
 *       />
 *       ...
 *     </>
 *   )
 * }
 */
export function EcommerceTracker({ item }: EcommerceTrackerProps) {
    useEffect(() => {
        trackViewItem(item)
    }, [item])

    return null
}
