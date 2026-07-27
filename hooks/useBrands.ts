// hooks/useBrands.ts
import useSWRInfinite from 'swr/infinite'
import { useEffect } from 'react'
import { IBrandListItem, IBrandListResponse } from '@/types/brands'
import { useSearchParams } from 'next/navigation'

const fetcher = async (url: string) => {
  const res = await fetch(url, {
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
  const { limit = 15 } = options

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

  const { data, error, size, setSize, isValidating } =
    useSWRInfinite<IBrandListResponse>(getKey, fetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateFirstPage: true, // ← важно: перезапрашивать при смене ключа
      keepPreviousData: false, // ← убираем, иначе старые данные остаются
    })

  // Сброс пагинации при смене поиска
  useEffect(() => {
    setSize(1)
  }, [search, setSize])

  const items = data ? data.flatMap((page) => page.results) : []
  const totalCount = data?.[0]?.count ?? 0
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
