// hooks/useBrandNomenclatures.ts
import { IBrandNomenclatureListResponse } from '@/types/brands'
import useSWRInfinite from 'swr/infinite'

const LIMIT = 5

const fetcher = async (url: string) => {
  const fullUrl = url.startsWith('/') ? url : `/${url}`
  const res = await fetch(fullUrl, {
    credentials: 'include',
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const useBrandNomenclatures = (brandId: string) => {
  const getKey = (
    pageIndex: number,
    previousData: IBrandNomenclatureListResponse | null
  ): string | null => {
    if (previousData && previousData.results.length < LIMIT && pageIndex > 0) {
      return null
    }

    const params = new URLSearchParams({
      limit: LIMIT.toString(),
      offset: (pageIndex * LIMIT).toString(),
    })

    return `/proxy-api/brands/${brandId}/nomenclatures/?${params.toString()}`
  }

  const { data, error, size, setSize, isValidating } =
    useSWRInfinite<IBrandNomenclatureListResponse>(getKey, fetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateFirstPage: false,
      keepPreviousData: false,
    })

  const items = data ? data.flatMap((page) => page.results) : []
  const totalCount = data?.[0]?.count ?? 0
  const lastPageData = data?.[data.length - 1]

  const hasMore = lastPageData
    ? lastPageData.results.length === LIMIT && items.length < totalCount
    : false

  const isLoadingInitial = !data && !error
  const isLoadingMore = isValidating && size > 1

  return {
    items,
    totalCount,
    hasMore,
    error,
    isLoadingInitial,
    isLoadingMore,
    size,
    setSize,
  }
}
