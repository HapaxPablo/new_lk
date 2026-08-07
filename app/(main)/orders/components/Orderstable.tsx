'use client'

import { Loader, Table, TextInput } from '@mantine/core'
import useSWRInfinite from 'swr/infinite'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
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
      const params = new URLSearchParams({
        page: String(pageIndex + 1),
        limit: '20',
      })
      if (search) params.set('nomenclature', search)
      return `/api/${endpoint}?${params.toString()}`
    },
    fetcher,
    { revalidateFirstPage: false }
  )

  const orders = data?.flatMap((page) => page.results) ?? []

  useEffect(() => {
    const element = observerRef.current
    if (!element || !viewportRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && data?.at(-1)?.next) {
          setSize((prev) => prev + 1)
        }
      },
      { root: viewportRef.current, rootMargin: '200px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [data, setSize])

  return (
    <div ref={viewportRef} style={{ height: 600, overflowY: 'auto' }}>
      <div className="mb-3">
        <TextInput
          value={searchInput}
          onChange={(event) => setSearchInput(event.currentTarget.value)}
          placeholder="Поиск по номенклатуре: бренд, населённый пункт или улица"
          aria-label="Поиск по номенклатуре"
        />
      </div>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {/* <Table.Th>Название</Table.Th> */}
            <Table.Th>Номенклатура</Table.Th>
            <Table.Th>Статус</Table.Th>
            <Table.Th>Создан</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {orders.map((order: any) => (
            <Table.Tr
              key={order.id}
              onClick={() => router.push(`/orders/${type}/${order.id}`)}
              style={{ cursor: 'pointer' }}
            >
              {/* <Table.Td>{order.name}</Table.Td> */}
              <Table.Td>
                {order.nomenclature || order.client?.name || '-'}
              </Table.Td>
              <Table.Td>
                {ORDER_STATUS_LABELS[order.status] ?? order.status}
              </Table.Td>
              <Table.Td>{order.owner}</Table.Td>
            </Table.Tr>
          ))}

          {isValidating && (
            <Table.Tr>
              <Table.Td colSpan={5}>
                <Loader size="sm" />
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      <div ref={observerRef} style={{ height: 1 }} />
    </div>
  )
}
