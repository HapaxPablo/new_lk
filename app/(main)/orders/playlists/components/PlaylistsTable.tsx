'use client'

import { Table, Loader, TextInput } from '@mantine/core'
import useSWRInfinite from 'swr/infinite'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IPlaylistsListResponse } from '@/types/playlists'
import { useDebounce } from '@/hooks/useDebounce'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PlaylistsTable({
  initialData,
  initialSearch = '',
}: {
  initialData: IPlaylistsListResponse
  initialSearch?: string
}) {
  const router = useRouter()
  const observerRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [searchInput, setSearchInput] = useState(initialSearch)
  const search = useDebounce(searchInput, 400)

  const { data, setSize, isValidating } =
    useSWRInfinite<IPlaylistsListResponse>(
      (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.next) {
          return null
        }
        const params = new URLSearchParams({
          page: String(pageIndex + 1),
          limit: '20',
        })
        if (search) params.set('search', search)
        return `/api/playlists/list?${params.toString()}`
      },
      fetcher,
      { fallbackData: [initialData], revalidateFirstPage: false }
    )

  const playlists = data?.flatMap((page) => page.results) ?? []

  useEffect(() => {
    const element = observerRef.current
    if (!element || !viewportRef.current) {
      return
    }

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

  const handleNavigate = (id: string) => {
    router.push(`/orders/playlists/${id}`)
  }

  return (
    <div className="h-[600px] overflow-y-auto" ref={viewportRef}>
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
        <TextInput
          value={searchInput}
          onChange={(event) => setSearchInput(event.currentTarget.value)}
          placeholder="Поиск по названию плейлиста или файла"
          aria-label="Поиск по плейлистам"
          mb="sm"
        />
        <div className="text-sm text-slate-500">
          Нажмите строку, чтобы перейти к расшифровке плейлиста
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <Table striped highlightOnHover className="min-w-[720px]">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Название</Table.Th>
              <Table.Th>Описание</Table.Th>
              <Table.Th>Файлов</Table.Th>
              <Table.Th>Создано</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {playlists.map((playlist) => (
              <Table.Tr
                key={playlist.id}
                onClick={() => handleNavigate(playlist.id)}
                style={{ cursor: 'pointer' }}
                className="outline-none focus-within:bg-blue-50"
              >
                <Table.Td className="font-semibold text-slate-800">{playlist.name}</Table.Td>
                <Table.Td className="max-w-sm truncate text-slate-500">{playlist.description || '—'}</Table.Td>
                <Table.Td><span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">{playlist.files_count ?? 0}</span></Table.Td>
                <Table.Td>{playlist.created || '-'}</Table.Td>
              </Table.Tr>
            ))}
            {isValidating && (
              <Table.Tr>
                <Table.Td colSpan={4} className="py-4">
                  <Loader size="sm" />
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
      <div ref={observerRef} style={{ height: 1 }} />
    </div>
  )
}
