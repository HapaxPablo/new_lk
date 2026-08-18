import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

export type FilterOptionsResponse<T> = T[] | { results?: T[] }

const fetchFilterOptions = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.status}`)
  }

  return response.json()
}

export const getFilterOptions = <T>(
  data: FilterOptionsResponse<T> | undefined
): T[] => (Array.isArray(data) ? data : data?.results ?? [])

/**
 * Кэширует результаты каждого поискового запроса. Повторное открытие селекта
 * подписывается на уже сохранённые данные и не инициирует новый запрос.
 */
export const useCachedFilterOptions = <T>(key: string | null) =>
  useSWR<FilterOptionsResponse<T>>(key, fetchFilterOptions, {
    keepPreviousData: true,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

interface PaginatedFilterOptions<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

interface CachedInfiniteFilterOptionsParams {
  isOpen: boolean
  endpoint: string
  search: string
  searchParam?: string
  params?: Record<string, string>
}

export const useCachedInfiniteFilterOptions = <T>({
  isOpen,
  endpoint,
  search,
  searchParam = 'search',
  params: baseParams = {},
}: CachedInfiniteFilterOptionsParams) => {
  const { data, error, size, setSize, isValidating, mutate } =
    useSWRInfinite<PaginatedFilterOptions<T>>(
      (pageIndex, previousPageData) => {
        if (!isOpen || previousPageData?.next === null) return null

        const params = new URLSearchParams({
          ...baseParams,
          page: String(pageIndex + 1),
        })
        if (search) params.set(searchParam, search)

        return `${endpoint}?${params.toString()}`
      },
      fetchFilterOptions,
      {
        keepPreviousData: true,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }
    )

  const lastPage = data?.[data.length - 1]
  const isLoading = !data && !error
  const isLoadingMore = isValidating && size > (data?.length ?? 0)
  const hasMore = lastPage?.next !== null && lastPage !== undefined

  return {
    options: data?.flatMap((page) => page.results) ?? [],
    error,
    isLoading,
    isLoadingMore,
    hasMore,
    mutate,
    loadMore: () => {
      if (hasMore && !isLoadingMore) {
        void setSize((currentSize) => currentSize + 1)
      }
    },
  }
}
