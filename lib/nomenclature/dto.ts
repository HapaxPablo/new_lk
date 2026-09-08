import type {
  INomenclatureItem,
  INomenclatureListItem,
  INomenclatureMapItem,
  INomenclatureMapPoint,
} from '@/types/nomenclature'

/**
 * Сжимает сущность 1С до минимума, который нужен каталогу:
 * карточка, корзина, select-all. Остальные поля (адреса, юрлица,
 * version, timezone и т.п.) в список не сериализуются.
 */
export function toNomenclatureListItem(
  item: INomenclatureItem
): INomenclatureListItem {
  const firstExterior = Array.isArray(item.exterior)
    ? item.exterior.find((image) => image?.source)?.source
    : undefined
  const exterior = firstExterior ? [{ source: firstExterior }] : []

  const formattedAddress =
    typeof item.formattedAddress === 'string'
      ? item.formattedAddress
      : item.formattedAddress?.name
        ? { name: item.formattedAddress.name }
        : ''

  const typeOfPlace =
    typeof item.typeOfPlace === 'string'
      ? item.typeOfPlace
      : {
          name: item.typeOfPlace?.name ?? '',
          abbreviation: item.typeOfPlace?.abbreviation ?? undefined,
        }

  return {
    id: item.id,
    name: item.name ?? '',
    oldCatalogSlug: item.oldCatalogSlug || item.id,
    pricePerMonth: item.pricePerMonth ?? '',
    brand: item.brand
      ? {
          name: item.brand.name ?? '',
          logotype: item.brand.logotype ?? '',
        }
      : null,
    exterior,
    formattedAddress,
    typeOfPlace,
  }
}

/** Точка карты с данными для превью в маркере. */
export function toNomenclatureMapPoint(
  item: INomenclatureMapItem
): INomenclatureMapPoint {
  return {
    id: item.id,
    title: item.name || item.brand?.name || 'Рекламная площадка',
    slug: item.old_slug || item.id,
    coordinates: item.coordinates ?? null,
    facade: item.facade
      ? {
          id: item.facade.id,
          source: item.facade.source,
        }
      : null,
    brand: item.brand
      ? {
          name: item.brand.name,
          logotype: item.brand.logotype,
        }
      : null,
    type_of_place: item.type_of_place,
    oldCatalogSlug: item.old_slug,
  }
}
