import useSWRInfinite from 'swr/infinite'

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface UseInfinitePaginatedResourceOptions<
  T,
  R extends PaginatedResponse<T>,
> {
  getKey: (pageIndex: number, previousData: R | null) => string | null
  fetcher?: (key: string) => Promise<R>
  initialData?: T[]
  initialCount?: number
  initialPage?: number
  limit?: number
  useInitialData?: boolean
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
  const {
    getKey,
    fetcher = defaultFetcher,
    initialData,
    initialCount,
    initialPage = 1,
    limit = 24,
    useInitialData = true,
  } = options

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite<R>(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateFirstPage: false,
      keepPreviousData: true,
    }
  )

  const items = data
    ? data.flatMap((page) => page.results)
    : useInitialData
      ? initialData || []
      : []
  const totalCount = data?.[0]?.count ?? initialCount ?? 0
  const lastPage = data?.[data.length - 1]
  const initialOffset = (initialPage - 1) * limit
  const hasInitialMore =
    !data &&
    useInitialData &&
    !!initialData &&
    initialData.length + initialOffset < (initialCount ?? 0)
  const hasMore = !error && (lastPage ? lastPage.next !== null : hasInitialMore)
  const isLoadingInitial = !data && !error
  const isLoadingMore = isValidating && size > 1

  return {
    items,
    totalCount,
    hasMore,
    error,
    mutate,
    isLoadingInitial,
    isLoadingMore,
    size,
    setSize,
  }
}
