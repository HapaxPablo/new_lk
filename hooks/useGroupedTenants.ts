import { IGroupedTenant, IGroupedTenantsResponse } from '@/types/tenants'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import useSWRInfinite from 'swr/infinite'

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: 'include',
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

interface UseGroupedTenantsOptions {
  initialData?: IGroupedTenant[]
  initialCount?: number
  limit?: number
}

export const useGroupedTenants = (options: UseGroupedTenantsOptions = {}) => {
  const { initialData, initialCount, limit = 15 } = options
  const searchParams = useSearchParams()
  const search = searchParams.get('search') || ''

  const getKey = (
    pageIndex: number,
    previousData: IGroupedTenantsResponse | null
  ): string | null => {
    if (previousData && previousData.results.length < limit) {
      return null
    }

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: (pageIndex * limit).toString(),
    })

    if (search) params.set('search', search)

    return `/api/tenants/grouped/?${params.toString()}`
  }

  const { data, error, size, setSize, isValidating } =
    useSWRInfinite<IGroupedTenantsResponse>(getKey, fetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateFirstPage: true,
      keepPreviousData: false,
      fallbackData:
        initialData && initialCount !== undefined
          ? [
              {
                count: initialCount,
                next: initialData.length < initialCount ? '' : null,
                previous: null,
                results: initialData,
              },
            ]
          : undefined,
    })

  useEffect(() => {
    setSize(1)
  }, [search, setSize])

  const items = data ? data.flatMap((page) => page.results) : []
  const totalCount = data?.[0]?.count ?? initialCount ?? 0
  const lastPageData = data?.[data.length - 1]

  const hasMore = lastPageData
    ? lastPageData.results.length === limit && items.length < totalCount
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
