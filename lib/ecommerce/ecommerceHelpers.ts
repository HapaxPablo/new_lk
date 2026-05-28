/**
 * Хелпер для отслеживания e-commerce событий в Яндекс.Метрике
 */

export interface EcommerceItem {
  item_id: string
  item_name: string
  item_category?: string
  item_brand?: string
  item_tenant?: string
  price: string
  currency?: string
}

/**
 * Отправляет событие в Яндекс.Метрику через dataLayer
 */
export function trackViewItem(item: EcommerceItem) {
  if (typeof window === 'undefined') return

  if (!window.dataLayer) {
    window.dataLayer = []
  }

  window.dataLayer.push({
    event: 'view_item',
    ecommerce: {
      items: [
        {
          item_id: item.item_id,
          item_name: item.item_name,
          item_category: item.item_category,
          item_brand: item.item_brand,
          price: item.price,
          currency: item.currency || 'RUB',
        },
      ],
    },
  })

  console.log('[E-commerce] view_item:', item.item_name)
}

export function trackSelectItem(
  item: EcommerceItem,
  listName?: string,
  index?: number
) {
  if (typeof window === 'undefined') return

  if (!window.dataLayer) {
    window.dataLayer = []
  }

  window.dataLayer.push({
    event: 'select_item',
    ecommerce: {
      item_list_name: listName || 'Список товаров',
      items: [
        {
          item_id: item.item_id,
          item_name: item.item_name,
          item_category: item.item_category,
          item_brand: item.item_brand,
          price: item.price,
          index: index || 0,
        },
      ],
    },
  })

  console.log('[E-commerce] select_item:', item.item_name)
}
