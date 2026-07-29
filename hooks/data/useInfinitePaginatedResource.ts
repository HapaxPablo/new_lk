import useSWRInfinite from 'swr/infinite'

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface UseInfinitePaginatedResourceOptions<T, R extends PaginatedResponse<T>> {
  getKey: (pageIndex: number, previousData: R | null) => string | null
  initialData?: T[]
  initialCount?: number
  limit?: number
}

const defaultFetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, {
    credentials: 'include',
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  }

  return res.json()
}

export const useInfinitePaginatedResource = <T, R extends PaginatedResponse<T>>(
  options: UseInfinitePaginatedResourceOptions<T, R>
) => {
  const { getKey, initialData, initialCount } = options

  const { data, error, size, setSize, isValidating } =
    useSWRInfinite<R>(getKey, defaultFetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateFirstPage: false,
      keepPreviousData: true,
    })

  const items = data ? data.flatMap((page) => page.results) : initialData || []
  const totalCount = data?.[0]?.count ?? initialCount ?? 0
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
