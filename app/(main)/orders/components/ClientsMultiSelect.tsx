'use client'
import { useRef } from 'react'
import { Check, X } from 'lucide-react'
import { usePaginatedSearch } from '@/hooks/usePaginatedSearch'
import { InfiniteScrollSentinel } from './InfiniteScrollSentinel'

export interface IClientOption {
  id: string
  name: string
}

interface Props {
  selected: IClientOption[]
  onToggle: (item: IClientOption) => void
  fetchPage: (
    page: number,
    search: string
  ) => Promise<{ results: IClientOption[]; next: string | null }>
  isOpen: boolean
  onError?: (message: string) => void
}

export function ClientsMultiSelect({
  selected,
  onToggle,
  fetchPage,
  isOpen,
  onError,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null)
  const { items, search, setSearch, hasMore, isLoading, loadMore } =
    usePaginatedSearch({
      enabled: isOpen,
      fetchPage,
      onError,
    })

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-gray-700">
        Клиенты
        {selected.length > 0 && (
          <span className="ml-1 text-gray-400">
            · выбрано {selected.length}
          </span>
        )}
      </label>

      <div className="grid gap-2 rounded-2xl border border-gray-200 bg-white p-3">
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggle(item)}
                className="flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
              >
                {item.name}
                <X size={12} />
              </button>
            ))}
          </div>
        )}

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Поиск клиентов"
          className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500"
        />

        <div
          ref={listRef}
          className="max-h-64 overflow-y-auto rounded-2xl border border-gray-100"
        >
          {items.map((item) => {
            const isSelected = selected.some((client) => client.id === item.id)
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggle(item)}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-gray-50 ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                <span>{item.name}</span>
                {isSelected && <Check size={14} className="text-blue-600" />}
              </button>
            )
          })}

          {!isLoading && items.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              Ничего не найдено
            </div>
          )}
          {isLoading && (
            <div className="px-4 py-3 text-sm text-gray-500">Загружаем...</div>
          )}

          <InfiniteScrollSentinel
            containerRef={listRef}
            onLoadMore={loadMore}
            hasMore={hasMore}
          />
        </div>
      </div>
    </div>
  )
}
