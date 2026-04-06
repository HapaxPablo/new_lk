import useSWRInfinite from 'swr/infinite'
import useSWR from 'swr'
import { ITenantsResponse } from '@/types/nomenclature'

const LIMIT = 15

interface IFloorOption {
  label: string
  value: string
}

const fetcher = async (url: string) => {
  const fullUrl = url.startsWith('/') ? url : `/${url}`
  console.log('🌐 Fetcher full URL:', fullUrl)

  const res = await fetch(fullUrl, {
    credentials: 'include',
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const useInfinityTenants = (
  nomenclatureId: string,
  search?: string,
  floor?: string,
  initialData?: ITenantsResponse | null
) => {
  const getKey = (
    pageIndex: number,
    previousData: ITenantsResponse | null
  ): string | null => {
    if (previousData && previousData.results.length < LIMIT && pageIndex > 0) {
      return null
    }

    const params = new URLSearchParams({
      limit: LIMIT.toString(),
      offset: (pageIndex * LIMIT).toString(),
    })

    if (search) {
      // console.log('🔍 Adding search param:', search)
      params.set('search', search)
      // console.log('🔍 Full params with search:', params.toString())
    }
    if (floor) {
      // console.log('🔍 Adding floor param:', floor)
      params.set('floor', floor)
      console.log('🔍 Full params with floor:', params.toString())
    }

    // Используем новый путь /proxy-api вместо /api
    return `/proxy-api/nomenclatures/${nomenclatureId}/tenant/?${params.toString()}`
  }

  const { data, error, size, setSize, isValidating } =
    useSWRInfinite<ITenantsResponse>(getKey, fetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateFirstPage: false,
      keepPreviousData: true,
      // fallbackData: initialData ? [initialData] : undefined,
    })

  const { data: floors } = useSWR<IFloorOption[]>(
    `/proxy-api/nomenclatures/${nomenclatureId}/tenant/floors/`,
    fetcher
  )

  const items = data ? data.flatMap((page) => page.results) : []
  const totalCount = data?.[0]?.count ?? 0
  const lastPageData = data?.[data.length - 1]

  const hasMore = lastPageData
    ? lastPageData.results.length === LIMIT && items.length < totalCount
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
    floors: floors || [],
  }
}
