import useSWRInfinite from 'swr/infinite'
import { useSearchParams } from 'next/navigation'
import { INomenclatureItem, INomenclatureResponse } from '@/types/nomenclature'
import { httpClient1CClient } from '@/lib/http-client/httpClient'

const getNomenclaturesFetcher = async (
  endpoint: string
): Promise<INomenclatureResponse> => {
  const res = await fetch(endpoint, {
    credentials: 'include',
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  }
  return res.json()
}

export const useInfiniteNomenclatures = (initialData?: INomenclatureItem[]) => {
  const searchParams = useSearchParams()

  const limit = Number(searchParams.get('limit')) || 24
  const search = searchParams.get('search') || ''
  const brandName = searchParams.get('brand_name') || ''
  const brandId = searchParams.get('brand_id') || ''
  const status = searchParams.get('status') || ''

  const getKey = (
    pageIndex: number,
    previousData: INomenclatureResponse | null
  ): string | null => {
    if (previousData && previousData.count <= (pageIndex + 1) * limit)
      return null
    const endpoint = new URL('/api/nomenclatures/')
    endpoint.searchParams.set('limit', limit.toString())
    endpoint.searchParams.set('page', (pageIndex + 1).toString())
    if (search) endpoint.searchParams.set('search', search)
    if (brandName) endpoint.searchParams.set('brand_name', brandName)
    if (brandId) endpoint.searchParams.set('brand_id', brandId)
    if (status) endpoint.searchParams.set('status', status)
    return endpoint.pathname + endpoint.search
  }

  const { data, error, size, setSize, isValidating } =
    useSWRInfinite<INomenclatureResponse>(getKey, getNomenclaturesFetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      keepPreviousData: true,
    })

  const items = data ? data.flatMap((page) => page.results) : initialData || []

  const totalCount = data?.[0]?.count || 0
  const hasMore = !error && size * limit < totalCount
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
