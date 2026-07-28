'use client'
import { useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { usePaginatedSearch } from '@/hooks/usePaginatedSearch'
import { useClickOutside } from '@/hooks/useClickOutside'
import { InfiniteScrollSentinel } from './InfiniteScrollSentinel'

export interface IPlaylistOption {
  id: string
  name: string
}

interface Props {
  value: string
  onChange: (id: string) => void
  fetchPage: (
    page: number,
    search: string
  ) => Promise<{ results: IPlaylistOption[]; next: string | null }>
  isOpen: boolean // открыто ли родительское модальное окно — триггер первой загрузки
  onError?: (message: string) => void
}

export function PlaylistSelect({
  value,
  onChange,
  fetchPage,
  isOpen,
  onError,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const { items, search, setSearch, hasMore, isLoading, loadMore } =
    usePaginatedSearch({
      enabled: isOpen,
      fetchPage,
      onError,
    })

  useClickOutside([wrapperRef], () => setIsDropdownOpen(false), isDropdownOpen)

  const selected = items.find((item) => item.id === value)

  return (
    <div className="grid gap-2" ref={wrapperRef}>
      <label className="text-sm font-medium text-gray-700">Плейлист</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-900 outline-none transition focus:border-blue-500"
        >
          <span className={selected ? '' : 'text-gray-400'}>
            {selected?.name || 'Выберите плейлист'}
          </span>
          <ChevronDown
            size={16}
            className={`shrink-0 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 mt-2 w-full rounded-2xl border border-gray-200 bg-white shadow-lg overflow-x-hidden">
            <div className="relative border-b border-gray-100 p-2">
              <Search
                size={14}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                autoFocus
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Поиск плейлистов"
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div ref={listRef} className="max-h-64 overflow-y-auto">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange(item.id)
                    setIsDropdownOpen(false)
                  }}
                  className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-3 text-left text-sm text-gray-900 last:border-0 hover:bg-gray-50"
                >
                  <span className="text-wrap">{item.name}</span>
                  {item.id === value && (
                    <Check size={14} className="text-blue-600" />
                  )}
                </button>
              ))}

              {!isLoading && items.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Ничего не найдено
                </div>
              )}
              {isLoading && (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Загружаем...
                </div>
              )}

              <InfiniteScrollSentinel
                containerRef={listRef}
                onLoadMore={loadMore}
                hasMore={hasMore}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
