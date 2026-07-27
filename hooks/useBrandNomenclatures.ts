import useSWR from 'swr'
import { IBrandNomenclatureShort } from '@/types/brands'

const fetcher = async (url: string) => {
  const fullUrl = url.startsWith('/') ? url : `/${url}`
  const res = await fetch(fullUrl, {
    credentials: 'include',
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }

  return res.json()
}

export const useBrandNomenclatures = (brandId: string) => {
  const { data, error, isLoading } = useSWR<IBrandNomenclatureShort[]>(
    `/proxy-api/brands/${brandId}/nomenclatures/`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  )

  return {
    items: data ?? [],
    totalCount: data?.length ?? 0,
    error,
    isLoadingInitial: isLoading,
  }
}
