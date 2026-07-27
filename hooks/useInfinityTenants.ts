import useSWRInfinite from 'swr/infinite'
import useSWR from 'swr'
import { ITenantsResponse } from '@/types/nomenclature'

const LIMIT = 15

interface IFloorOption {
  label: string
  value: string
}

const floorFetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include', cache: 'no-store' })
  const json = await res.json()
  if (!res.ok || json?.ok === false) {
    throw new Error(json?.message || `HTTP ${res.status}`)
  }
  return json.data // этажи приходят в data
}

const tenantsFetcher = async (url: string): Promise<ITenantsResponse> => {
  const res = await fetch(url, { credentials: 'include', cache: 'no-store' })
  const json = await res.json()
  if (!res.ok || json?.ok === false) {
    throw new Error(json?.message || `HTTP ${res.status}`)
  }
  return json // не json.data, а сам объект с count и results
}

export const useInfinityTenants = (
  nomenclatureId: string,
  search?: string,
  floor?: string,
  initialData?: ITenantsResponse | null,
  enabled: boolean = true
) => {
  const getKey = (
    pageIndex: number,
    previousData: ITenantsResponse | null
  ): string | null => {
    if (!nomenclatureId || !enabled) return null
    if (
      previousData?.results &&
      previousData.results.length < LIMIT &&
      pageIndex > 0
    ) {
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

    return `${process.env.API_1C_URL}api/nomenclatures/${nomenclatureId}/tenant/?${params.toString()}`
  }

  const { data, error, size, setSize, isValidating, mutate } =
    useSWRInfinite<ITenantsResponse>(getKey, tenantsFetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateFirstPage: false,
      keepPreviousData: false,
    })

  const { data: floors } = useSWR(
    enabled && nomenclatureId
      ? `${process.env.API_1C_URL}api/nomenclatures/${nomenclatureId}/tenant/floors/`
      : null,
    floorFetcher
  )

  const items = data ? data.flatMap((page) => page?.results ?? []) : []
  const totalCount = data?.[0]?.count ?? 0
  const lastPageData =
    data && data.length > 0 ? data[data.length - 1] : undefined

  const hasMore =
    lastPageData?.results?.length === LIMIT && items.length < totalCount

  const isLoadingMore = isValidating && size > 1
  const floorsList = floors ?? []
  const isLoadingInitial = !data && !error && enabled
  return {
    items,
    totalCount,
    hasMore,
    error,
    isLoadingInitial,
    isLoadingMore,
    size,
    setSize,
    mutate,
    floors: floorsList,
  }
}
