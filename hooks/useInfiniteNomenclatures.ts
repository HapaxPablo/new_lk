import useSWRInfinite from 'swr/infinite'
import { useSearchParams } from 'next/navigation'
import { INomenclatureItem, INomenclatureResponse } from '@/types/nomenclature'
// import { httpClient1CClient } from '@/lib/http-client/httpClient'

const getNomenclaturesFetcher = async (
  endpoint: string,
  pageIndex?: number
): Promise<INomenclatureResponse> => {
  console.log('🔗 Fetching nomenclatures swr:', endpoint)
  const res = await fetch(endpoint, {
    credentials: 'include',
    cache: 'no-store',
  })
  if (!res.ok) {
    console.error('❌ SWR fetch failed:', endpoint, res.status)
    throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  }
  const data = await res.json()
  console.log('✅ SWR data:', {
    pageIndex,
    count: data.count,
    resultsLength: data.results.length,
    nextKey: endpoint,
  })
  return data
}

export const useInfiniteNomenclatures = (
  initialData?: INomenclatureItem[],
  initialServerCount?: number,
  initialPage?: number
) => {
  // const pageParam = initialPage || 1
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
    if (previousData && (pageIndex + 1) * limit >= previousData.count)
      return null
    const params = new URLSearchParams({
      limit: limit.toString(),
      page: (pageIndex + 1).toString(),
    })
    if (search) params.set('search', search)
    if (brandName) params.set('brand_name', brandName)
    if (brandId) params.set('brand_id', brandId)
    if (status) params.set('status', status)
    return `/api/nomenclatures/?${params.toString()}`
  }

  console.log('🔑 SWR key:', getKey(1, null))

  const { data, error, size, setSize, isValidating } =
    useSWRInfinite<INomenclatureResponse>(getKey, getNomenclaturesFetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateFirstPage: false,
      keepPreviousData: true,
    })

  const items = data ? data.flatMap((page) => page.results) : initialData || []

  const totalCount = data?.[0]?.count || initialServerCount || 0

  const lastPageData = data?.[data.length - 1] || null
  const nextKey = getKey(size, lastPageData)
  const hasMore = !error && !!nextKey

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
