import useSWRInfinite from 'swr/infinite'
import { useSearchParams } from 'next/navigation'
import { INomenclatureItem, INomenclatureResponse } from '@/types/nomenclature'

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

export const useInfiniteNomenclatures = (
  initialData?: INomenclatureItem[],
  initialServerCount?: number,
  initialPage?: number
) => {
  const searchParams = useSearchParams()

  const limit = Number(searchParams.get('limit')) || 24
  const search = searchParams.get('search') || ''
  const brandName = searchParams.get('brand_name') || ''
  const brandId = searchParams.get('brand_id') || ''
  const status = searchParams.get('status') || ''
  const typeOfPlace = searchParams.get('type_of_place') || ''

  const getKey = (
    pageIndex: number,
    previousData: INomenclatureResponse | null
  ): string | null => {
    // Если предыдущая страница вернула next: null — данные кончились
    if (previousData && previousData.next === null) return null

    const params = new URLSearchParams({
      limit: limit.toString(),
      page: (pageIndex + 1).toString(),
    })
    if (search) params.set('search', search)
    if (brandName) params.set('brand_name', brandName)
    if (brandId) params.set('brand_id', brandId)
    if (status) params.set('status', status)
    if (typeOfPlace) params.set('type_of_place', typeOfPlace)
    return `/api/nomenclatures/?${params.toString()}`
  }

  const { data, error, size, setSize, isValidating } =
    useSWRInfinite<INomenclatureResponse>(getKey, getNomenclaturesFetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateFirstPage: false,
      keepPreviousData: true,
    })

  const items = data ? data.flatMap((page) => page.results) : initialData || []
  const totalCount = data?.[0]?.count || initialServerCount || 0

  // hasMore — смотрим на next последней загруженной страницы
  const lastPage = data?.[data.length - 1]
  const hasMore = !error && !!lastPage && lastPage.next !== null

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
