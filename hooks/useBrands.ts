import { useEffect } from 'react'
import { IBrandListItem, IBrandListResponse } from '@/types/brands'
import { useSearchParams } from 'next/navigation'
import { useInfinitePaginatedResource } from './data/useInfinitePaginatedResource'

interface UseBrandsOptions {
  initialData?: IBrandListItem[]
  initialCount?: number
  limit?: number
  initialOffset?: number
}

export const useBrands = (options: UseBrandsOptions = {}) => {
  const { limit = 15, initialData, initialCount } = options

  const searchParams = useSearchParams()
  const search = searchParams.get('search') || ''

  const getKey = (
    pageIndex: number,
    previousData: IBrandListResponse | null
  ): string | null => {
    if (previousData && previousData.results.length < limit) {
      return null
    }

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: (pageIndex * limit).toString(),
    })
    if (search) params.set('search', search)

    const key = `/proxy-api/brands/assigned/?${params.toString()}`
    return key
  }

  const paginated = useInfinitePaginatedResource<IBrandListItem, IBrandListResponse>(
    {
      getKey,
      initialData,
      initialCount,
    }
  )

  const { setSize } = paginated

  // Сброс пагинации при смене поиска
  useEffect(() => {
    setSize(1)
  }, [search, setSize])

  return paginated
}
