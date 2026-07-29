import { useSearchParams } from 'next/navigation'
import { INomenclatureItem, INomenclatureResponse } from '@/types/nomenclature'
import { useInfinitePaginatedResource } from './data/useInfinitePaginatedResource'

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

  return useInfinitePaginatedResource<INomenclatureItem, INomenclatureResponse>(
    {
      getKey,
      initialData,
      initialCount: initialServerCount,
    }
  )
}
