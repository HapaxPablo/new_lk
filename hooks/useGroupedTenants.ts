import { IGroupedTenant, IGroupedTenantsResponse } from '@/types/tenants'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useInfinitePaginatedResource } from './data/useInfinitePaginatedResource'

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

  const paginated = useInfinitePaginatedResource<
    IGroupedTenant,
    IGroupedTenantsResponse
  >({
    getKey,
    initialData,
    initialCount,
  })

  const {
    items,
    totalCount,
    hasMore,
    error,
    isLoadingInitial,
    isLoadingMore,
    size,
    setSize,
  } = paginated

  useEffect(() => {
    setSize(1)
  }, [search, setSize])

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
