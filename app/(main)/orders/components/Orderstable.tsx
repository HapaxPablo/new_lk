'use client'

import { Loader, Table, TextInput } from '@mantine/core'
import useSWRInfinite from 'swr/infinite'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { ORDER_STATUS_LABELS } from '@/types/orders'
import { useDebounce } from '@/hooks/useDebounce'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Props {
  type: 'ad' | 'bg'
}

export default function OrdersTable({ type }: Props) {
  const router = useRouter()
  const observerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [searchInput, setSearchInput] = useState('')
  const search = useDebounce(searchInput, 400)
  const endpoint = type === 'ad' ? 'adorders' : 'bgorders'

  const { data, setSize, isValidating } = useSWRInfinite(
    (pageIndex, previousPage) => {
      if (previousPage && !previousPage.next) return null
      const params = new URLSearchParams({ page: String(pageIndex + 1), limit: '20' })
      if (search) params.set('nomenclature', search)
      return `/api/${endpoint}?${params.toString()}`
    },
    fetcher,
    { revalidateFirstPage: false }
  )

  const orders = data?.flatMap((page) => page.results) ?? []
  const statusClass = (status: number) => {
    if (status === 1) return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
    if (status === 2) return 'bg-slate-100 text-slate-600 ring-slate-500/20'
    if (status === 3 || status === 4) return 'bg-rose-50 text-rose-700 ring-rose-600/20'
    return 'bg-amber-50 text-amber-700 ring-amber-600/20'
  }

  useEffect(() => {
    const element = observerRef.current
    if (!element || !viewportRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && data?.at(-1)?.next) setSize((prev) => prev + 1)
      },
      { root: viewportRef.current, rootMargin: '200px' }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [data, setSize])

  return (
    <div ref={viewportRef} className="h-[580px] overflow-y-auto">
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <TextInput value={searchInput} onChange={(event) => setSearchInput(event.currentTarget.value)} placeholder="Поиск по бренду, городу или улице" aria-label="Поиск по заказам" classNames={{ input: 'h-11 rounded-xl border-slate-200 pl-10 text-sm focus:border-blue-500' }} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table striped highlightOnHover className="min-w-[680px]">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Номенклатура / клиент</Table.Th>
            <Table.Th>Статус</Table.Th>
            <Table.Th>Автор</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orders.map((order: any) => (
            <Table.Tr
              key={order.id}
              onClick={() => router.push(`/orders/${type}/${order.id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  router.push(`/orders/${type}/${order.id}`)
                }
              }}
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600 focus-within:bg-blue-50"
            >
              <Table.Td className="py-4">
                <div className="font-semibold text-slate-800">{order.nomenclature || order.client?.name || 'Без названия'}</div>
                {order.name && <div className="mt-1 text-xs text-slate-500">{order.name}</div>}
              </Table.Td>
              <Table.Td>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass(order.status)}`}>
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </span>
              </Table.Td>
              <Table.Td className="text-slate-600">{order.owner?.full_name || order.owner || '—'}</Table.Td>
            </Table.Tr>
          ))}
          {!isValidating && orders.length === 0 && (
            <Table.Tr><Table.Td colSpan={3} className="py-12 text-center text-sm text-slate-500">По этому запросу заказов не найдено.</Table.Td></Table.Tr>
          )}
          {isValidating && (
            <Table.Tr><Table.Td colSpan={3} className="py-4"><Loader size="sm" /></Table.Td></Table.Tr>
          )}
        </Table.Tbody>
        </Table>
      </div>
      <div ref={observerRef} className="h-px" />
    </div>
  )
}
