// hooks/useBrands.ts
import useSWRInfinite from 'swr/infinite'
import { IBrandListItem, IBrandListResponse } from '@/types/brands'

const fetcher = async (url: string) => {
  const fullUrl = url.startsWith('/') ? url : `/${url}`
  const res = await fetch(fullUrl, {
    credentials: 'include',
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
interface UseBrandsOptions {
  initialData?: IBrandListItem[]
  initialCount?: number
  limit?: number
  initialOffset?: number
}

export const useBrands = (options: UseBrandsOptions = {}) => {
  const {
    initialData = [],
    initialCount = 0,
    limit = 15,
    initialOffset = 0,
  } = options

  const getKey = (
    pageIndex: number,
    previousData: IBrandListResponse | null
  ): string | null => {
    // Если это первая страница или данные еще пусты
    if (pageIndex === 0) {
      return `/proxy-api/brands/assigned/?limit=${limit}&offset=0`
    }

    // Остановить, если получили меньше, чем запросили
    if (previousData && previousData.results.length < limit) {
      return null
    }

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: (pageIndex * limit).toString(),
    })

    return `/proxy-api/brands/assigned/?${params.toString()}`
  }

  const { data, error, size, setSize, isValidating } =
    useSWRInfinite<IBrandListResponse>(getKey, fetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateFirstPage: false,
      keepPreviousData: true,
      fallbackData:
        initialData.length > 0
          ? [
              {
                results: initialData,
                count: initialCount,
                next: initialCount > initialData.length ? 'next' : null,
                previous: null,
              },
            ]
          : undefined,
    })

  const items = data ? data.flatMap((page) => page.results) : initialData
  const totalCount = data?.[0]?.count ?? initialCount
  const lastPageData = data?.[data.length - 1]

  const hasMore = lastPageData
    ? lastPageData.results.length === limit && items.length < totalCount
    : initialData.length < initialCount

  const isLoadingInitial = !data && !error && initialData.length === 0
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
