import {
  INomenclatureListItem,
  INomenclatureListResponse,
} from '@/types/nomenclature'
import { useInfinitePaginatedResource } from './data/useInfinitePaginatedResource'
import { useNomenclatureFiltersStore } from '@/store/useNomenclatureFiltersStore'

export const useInfiniteNomenclatures = (
  initialData?: INomenclatureListItem[],
  initialServerCount?: number,
  initialPage?: number,
  pageLimit = 24
) => {
  const filters = useNomenclatureFiltersStore((state) => state.filters)
  const hasHydrated = useNomenclatureFiltersStore((state) => state.hasHydrated)
  const limit = Math.min(Math.max(1, pageLimit), 24)
  const hasFilters = Object.keys(filters).length > 0

  const getKey = (
    pageIndex: number,
    previousData: INomenclatureListResponse | null
  ): string | null => {
    if (!hasHydrated) return null
    if (previousData && previousData.next === null) return null

    const body: Record<string, string | number | boolean | string[]> = {
      limit,
      page: (initialPage || 1) + pageIndex,
    }
    if (filters.search) body.search = filters.search
    if (filters.brand_name) body.brand_name = filters.brand_name
    if (filters.brand_id) {
      const brandIds = filters.brand_id.split(',').filter(Boolean)
      if (brandIds.length > 1) {
        body.brand_ids = brandIds
      } else {
        body.brand_id = brandIds[0]
      }
    }
    if (filters.counterparty_id) {
      const counterpartyIds = filters.counterparty_id.split(',').filter(Boolean)
      if (counterpartyIds.length > 1) {
        body.counterparty_ids = counterpartyIds
      } else {
        body.counterparty_id = counterpartyIds[0]
      }
    }
    if (filters.status) body.status = filters.status
    if (filters.type_of_place) body.type_of_place = filters.type_of_place
    if (filters.city_slug) body.city_slug = filters.city_slug
    if (filters.content_types) {
      body.content_types = filters.content_types
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
    }
    if (filters.price_from) body.price_from = filters.price_from
    if (filters.price_to) body.price_to = filters.price_to
    if (filters.has_facade) {
      body.has_facade = filters.has_facade === 'true'
    }
    return JSON.stringify(body)
  }

  const fetcher = async (body: string): Promise<INomenclatureListResponse> => {
    const response = await fetch('/api/nomenclatures/', {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }

    return response.json()
  }

  return useInfinitePaginatedResource<
    INomenclatureListItem,
    INomenclatureListResponse
  >({
    getKey,
    fetcher,
    initialData,
    initialCount: initialServerCount,
    initialPage,
    limit,
    useInitialData: !hasFilters,
  })
}
