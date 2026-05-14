// hooks/useBrandNomenclatures.ts
import { IBrandNomenclatureListResponse } from '@/types/brands'
import useSWRInfinite from 'swr/infinite'

const LIMIT = 25

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
    if (pageIndex === 0) {
      return `/proxy-api/brands/${brandId}/nomenclatures/?limit=${LIMIT}&offset=0`
    }
    if (!previousData) return null
    if (!previousData.next) return null

    return `/proxy-api/brands/${brandId}/nomenclatures/?limit=${LIMIT}&offset=${pageIndex * LIMIT}`
  }

  const { data, error, size, setSize, isValidating } =
    useSWRInfinite<IBrandNomenclatureListResponse>(getKey, fetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateFirstPage: false,
      keepPreviousData: false,
    })

  const rawItems = data ? data.flatMap((page) => page.results) : []

  // Временно для отладки
  console.log('pages count:', data?.length)
  data?.forEach((page, i) => {
    console.log(
      `page ${i}:`,
      page.results.map((r) => r.id)
    )
  })

  const seen = new Set<string>()
  const items = rawItems.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })

  const totalCount = data?.[0]?.count ?? 0
  const lastPageData = data?.[data.length - 1]
  const hasMore = !!lastPageData?.next

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
