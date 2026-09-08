'use client'
import { useCallback, useEffect, useState } from 'react'

interface PageResult<T> {
  results: T[]
  next: string | null
}

interface Options<T> {
  enabled: boolean
  fetchPage: (page: number, search: string) => Promise<PageResult<T>>
  onError?: (message: string) => void
  minSearchLength?: number
}

export function usePaginatedSearch<T>({
  enabled,
  fetchPage,
  onError,
  minSearchLength = 0,
}: Options<T>) {
  const [items, setItems] = useState<T[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const load = useCallback(
    async (pageToLoad: number, term: string) => {
      setIsLoading(true)
      try {
        const data = await fetchPage(pageToLoad, term)
        setItems((prev) =>
          pageToLoad === 1 ? data.results : [...prev, ...data.results]
        )
        setHasMore(Boolean(data.next))
      } catch (error) {
        onError?.(
          error instanceof Error ? error.message : 'Не удалось загрузить данные'
        )
      } finally {
        setIsLoading(false)
      }
    },
    [fetchPage, onError]
  )

  // первая загрузка / сброс при открытии или изменении поиска
  useEffect(() => {
    if (!enabled) return

    setPage(1)

    const normalizedSearch = search.trim()
    if (
      normalizedSearch.length > 0 &&
      normalizedSearch.length < minSearchLength
    ) {
      setItems([])
      setHasMore(false)
      return
    }

    load(1, search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, minSearchLength, search])

  // подгрузка следующих страниц
  useEffect(() => {
    const normalizedSearch = search.trim()
    const isSearchTooShort =
      normalizedSearch.length > 0 && normalizedSearch.length < minSearchLength

    if (page === 1 || isSearchTooShort) return

    load(page, search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) setPage((p) => p + 1)
  }, [hasMore, isLoading])

  const reset = useCallback(() => {
    setItems([])
    setSearch('')
    setPage(1)
    setHasMore(true)
  }, [])

  return { items, search, setSearch, hasMore, isLoading, loadMore, reset }
}
