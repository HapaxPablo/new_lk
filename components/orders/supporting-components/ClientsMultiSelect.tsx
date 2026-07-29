'use client'
import { useRef, useState } from 'react'
import { Check, ChevronDown, Eye, Search } from 'lucide-react'
import { usePaginatedSearch } from '@/hooks/usePaginatedSearch'
import { useClickOutside } from '@/hooks/useClickOutside'
import { InfiniteScrollSentinel } from './InfiniteScrollSentinel'
import Link from 'next/link'

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
  isOpen: boolean // открыто ли родительское модальное окно — триггер первой загрузки
  onError?: (message: string) => void
}

export function ClientsMultiSelect({
  selected,
  onToggle,
  fetchPage,
  isOpen,
  onError,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [visible, setVisible] = useState<string | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const { items, search, setSearch, hasMore, isLoading, loadMore } =
    usePaginatedSearch({
      enabled: isOpen,
      fetchPage,
      onError,
    })

  useClickOutside([wrapperRef], () => setIsDropdownOpen(false), isDropdownOpen)

  const isSelected = (id: string) => selected.some((item) => item.id === id)

  return (
    <div className="grid gap-2" ref={wrapperRef}>
      <label className="text-sm font-medium text-gray-700">
        Клиенты
        {selected.length > 0 && (
          <span className="ml-1 text-gray-400">
            · выбрано {selected.length}
          </span>
        )}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-900 outline-none transition focus:border-blue-500"
        >
          <span className={selected.length ? '' : 'text-gray-400'}>
            {selected.length
              ? `Выбрано клиентов: ${selected.length}`
              : 'Выберите клиентов'}
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
                placeholder="Поиск клиентов"
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div ref={listRef} className="max-h-64 overflow-y-auto">
              {selected.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="px-4 pt-2 pb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Выбранные
                  </div>

                  {selected.map((item) => (
                    <button
                      key={`selected-${item.id}`}
                      type="button"
                      onClick={() => onToggle(item)}
                      onMouseEnter={() => setVisible(item.id)}
                      onMouseLeave={() => setVisible(null)}
                      className="flex w-full items-center justify-between border-b border-gray-100 bg-blue-50 px-4 py-3 text-left text-sm text-gray-900 last:border-0 hover:bg-blue-100"
                    >
                      <span className="text-wrap">{item.name}</span>
                      {visible === item.id && (
                        <Link
                          href={`/nomenclatures/${item.id}`}
                          target="_blank"
                        >
                          <Eye
                            size={20}
                            className="text-gray-400 hover:cursor-pointer"
                          />
                        </Link>
                      )}
                      <Check size={14} className="text-blue-600" />
                    </button>
                  ))}
                </div>
              )}
              <div className="border-b border-gray-100">
                <div className="px-4 pt-2 pb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                  Все точки
                </div>

                {items.map((item) => {
                  const selectedFlag = isSelected(item.id)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onToggle(item)}
                      onMouseEnter={() => setVisible(item.id)}
                      onMouseLeave={() => setVisible(null)}
                      className={`flex w-full items-center justify-between border-b border-gray-100 px-4 py-3 text-left text-sm last:border-0 hover:bg-gray-50 ${
                        selectedFlag ? 'bg-blue-50' : 'text-gray-900'
                      }`}
                    >
                      <span className="text-wrap">{item.name}</span>
                      {visible === item.id && (
                        <Link
                          href={`/nomenclatures/${item.id}`}
                          target="_blank"
                        >
                          <Eye
                            size={20}
                            className="text-gray-400 hover:cursor-pointer"
                          />
                        </Link>
                      )}
                      {selectedFlag && (
                        <Check size={14} className="text-blue-600" />
                      )}
                    </button>
                  )
                })}
              </div>
              {!isLoading && items.length === 0 && selected.length === 0 && (
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
