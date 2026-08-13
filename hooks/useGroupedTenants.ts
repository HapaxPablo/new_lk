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
  const category = searchParams.get('category') || ''
  const city = searchParams.get('city') || ''
  const sort = searchParams.get('sort') || 'count_desc'

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
    if (category) params.set('category', category)
    if (city) params.set('city', city)
    if (sort) params.set('sort', sort)

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
  }, [search, category, city, sort, setSize])

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
