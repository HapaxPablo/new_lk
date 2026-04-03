// import useSWRInfinite from 'swr/infinite'
// import useSWR from 'swr'
// import { ITenantsResponse } from '@/types/nomenclature'

// const downloadJson = (filename: string, data: unknown) => {
//   const blob = new Blob([JSON.stringify(data, null, 2)], {
//     type: 'application/json',
//   })

//   const url = URL.createObjectURL(blob)
//   const a = document.createElement('a')
//   a.href = url
//   a.download = filename
//   document.body.appendChild(a)
//   a.click()
//   a.remove()
//   URL.revokeObjectURL(url)
// }

// const LIMIT = 15

// interface IFloorOption {
//   label: string
//   value: string
// }

// const BASE_URL =
//   process.env.NEXT_PUBLIC_API_1C_URL || 'https://api1.krasrm.com/'

// const fetcher = async (url: string) => {
//   const fullUrl = `${BASE_URL}${url}`
//   console.log('🌐 Fetcher full URL:', fullUrl)

//   const res = await fetch(fullUrl, {
//     credentials: 'include',
//     cache: 'no-store',
//   })

//   if (!res.ok) throw new Error(`HTTP ${res.status}`)
//   return res.json()
// }

// export const useInfinityTenants = (
//   nomenclatureId: string,
//   search?: string,
//   floor?: string,
//   initialData?: ITenantsResponse | null
// ) => {
//   const getKey = (
//     pageIndex: number,
//     previousData: ITenantsResponse | null
//   ): string | null => {
//     if (previousData && previousData.results.length < LIMIT) return null

//     const params = new URLSearchParams({
//       limit: LIMIT.toString(),
//       offset: (pageIndex * LIMIT).toString(),
//     })

//     if (search) params.set('search', search)
//     if (floor) params.set('floor', floor)

//     return `api/nomenclatures/${nomenclatureId}/tenant/?${params.toString()}`
//   }

//   const { data, error, size, setSize, isValidating } =
//     useSWRInfinite<ITenantsResponse>(getKey, fetcher, {
//       revalidateOnFocus: false,
//       revalidateIfStale: false,
//       revalidateFirstPage: false,
//       keepPreviousData: false,
//     })

//   const { data: floors } = useSWR<IFloorOption[]>(
//     `api/nomenclatures/${nomenclatureId}/tenant/floors/`,
//     fetcher
//   )

//   const rawItems = data
//     ? data.flatMap((page) => page.results)
//     : initialData?.results || []

//   // if (process.env.NODE_ENV === 'development' && data?.length) {
//   //   const allWithMeta = data.flatMap((page, pageIndex) =>
//   //     page.results.map((item, itemIndex) => ({
//   //       ...item,
//   //       __page: pageIndex,
//   //       __offset: pageIndex * LIMIT,
//   //       __indexInPage: itemIndex,
//   //     }))
//   //   )

//   //   // 1. Повторы по tenant.id
//   //   const duplicateTenantIds = new Map<
//   //     string,
//   //     {
//   //       count: number
//   //       entries: Array<{
//   //         brands_list: string
//   //         floor: string
//   //         page: number
//   //         offset: number
//   //         indexInPage: number
//   //       }>
//   //     }
//   //   >()

//   //   allWithMeta.forEach((item) => {
//   //     const existing = duplicateTenantIds.get(item.id)

//   //     if (existing) {
//   //       existing.count += 1
//   //       existing.entries.push({
//   //         brands_list: item.brands_list,
//   //         floor: item.floor,
//   //         page: item.__page,
//   //         offset: item.__offset,
//   //         indexInPage: item.__indexInPage,
//   //       })
//   //     } else {
//   //       duplicateTenantIds.set(item.id, {
//   //         count: 1,
//   //         entries: [
//   //           {
//   //             brands_list: item.brands_list,
//   //             floor: item.floor,
//   //             page: item.__page,
//   //             offset: item.__offset,
//   //             indexInPage: item.__indexInPage,
//   //           },
//   //         ],
//   //       })
//   //     }
//   //   })

//   //   const repeatedTenantIds = Array.from(duplicateTenantIds.entries())
//   //     .filter(([, value]) => value.count > 1)
//   //     .map(([id, value]) => ({
//   //       tenantId: id,
//   //       repeats: value.count,
//   //       entries: value.entries,
//   //     }))

//   //   if (repeatedTenantIds.length) {
//   //     console.group('🟡 Повторы по tenant.id (возможно это разные этажи)')

//   //     repeatedTenantIds.forEach((item) => {
//   //       console.warn(`🧍 tenant.id повторяется: ${item.tenantId}`)
//   //       console.table(item.entries)
//   //     })

//   //     console.groupEnd()
//   //   }

//   //   // 2. Настоящие дубли по tenant.id + floor
//   //   const exactDuplicates = new Map<
//   //     string,
//   //     {
//   //       count: number
//   //       entries: Array<{
//   //         id: string
//   //         brands_list: string
//   //         floor: string
//   //         page: number
//   //         offset: number
//   //         indexInPage: number
//   //       }>
//   //     }
//   //   >()

//   //   allWithMeta.forEach((item) => {
//   //     const compositeKey = `${item.id}-${item.floor}`
//   //     const existing = exactDuplicates.get(compositeKey)

//   //     if (existing) {
//   //       existing.count += 1
//   //       existing.entries.push({
//   //         id: item.id,
//   //         brands_list: item.brands_list,
//   //         floor: item.floor,
//   //         page: item.__page,
//   //         offset: item.__offset,
//   //         indexInPage: item.__indexInPage,
//   //       })
//   //     } else {
//   //       exactDuplicates.set(compositeKey, {
//   //         count: 1,
//   //         entries: [
//   //           {
//   //             id: item.id,
//   //             brands_list: item.brands_list,
//   //             floor: item.floor,
//   //             page: item.__page,
//   //             offset: item.__offset,
//   //             indexInPage: item.__indexInPage,
//   //           },
//   //         ],
//   //       })
//   //     }
//   //   })

//   //   const realDuplicates = Array.from(exactDuplicates.entries())
//   //     .filter(([, value]) => value.count > 1)
//   //     .map(([compositeKey, value]) => ({
//   //       compositeKey,
//   //       repeats: value.count,
//   //       entries: value.entries,
//   //     }))

//   //   if (realDuplicates.length) {
//   //     console.group('🚨 Настоящие дубли по tenant.id + floor')

//   //     realDuplicates.forEach((item) => {
//   //       console.error(`🔁 Дубликат записи: ${item.compositeKey}`)
//   //       console.table(item.entries)
//   //     })

//   //     console.groupEnd()
//   //   }

//   //   // 3. Скачать JSON, если есть хоть какие-то подозрения
//   //   if (repeatedTenantIds.length || realDuplicates.length) {
//   //     const payload = {
//   //       generatedAt: new Date().toISOString(),
//   //       nomenclatureId,
//   //       activeSearch: search || '',
//   //       activeFloorFilter: floor || '',
//   //       totalPagesLoaded: data.length,
//   //       totalRawItems: allWithMeta.length,
//   //       repeatedTenantIds,
//   //       realDuplicates,
//   //     }

//   //     downloadJson(
//   //       `tenant-duplicates-${nomenclatureId}-${Date.now()}.json`,
//   //       payload
//   //     )
//   //   }
//   // }

//   const items = Array.from(
//     new Map(rawItems.map((item) => [`${item.id}`, item])).values()
//   )

//   const totalCount = data?.[0]?.count ?? initialData?.count ?? 0
//   const lastPageData = data?.[data.length - 1] || null

//   const hasMore =
//     !!lastPageData &&
//     lastPageData.results.length === LIMIT &&
//     rawItems.length < totalCount

//   const isLoadingInitial = !data && !error
//   const isLoadingMore = isValidating && size > 1

//   return {
//     items,
//     totalCount,
//     hasMore,
//     error,
//     isLoadingInitial,
//     isLoadingMore,
//     size,
//     setSize,
//     floors: floors || [],
//   }
// }
import useSWRInfinite from 'swr/infinite'
import useSWR from 'swr'
import { ITenantsResponse } from '@/types/nomenclature'

const LIMIT = 15

interface IFloorOption {
  label: string
  value: string
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_1C_URL || 'https://api1.krasrm.com/'

const fetcher = async (url: string) => {
  const fullUrl = `${BASE_URL}${url}`
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
    if (previousData && previousData.results.length < LIMIT) return null

    const params = new URLSearchParams({
      limit: LIMIT.toString(),
      offset: (pageIndex * LIMIT).toString(),
    })

    if (search) params.set('search', search)
    if (floor) params.set('floor', floor)

    return `api/nomenclatures/${nomenclatureId}/tenant/?${params.toString()}`
  }

  const { data, error, size, setSize, isValidating } =
    useSWRInfinite<ITenantsResponse>(getKey, fetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateFirstPage: false,
      keepPreviousData: false,
    })

  const { data: floors } = useSWR<IFloorOption[]>(
    `api/nomenclatures/${nomenclatureId}/tenant/floors/`,
    fetcher
  )

  const items = data
    ? data.flatMap((page) => page.results)
    : initialData?.results || []

  const totalCount = data?.[0]?.count ?? initialData?.count ?? 0
  const lastPageData = data?.[data.length - 1] || null

  const hasMore =
    !!lastPageData &&
    lastPageData.results.length === LIMIT &&
    items.length < totalCount

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
