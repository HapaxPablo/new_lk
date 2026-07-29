'use client'

import { Table, Loader } from '@mantine/core'
import useSWRInfinite from 'swr/infinite'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { IPlaylistsListResponse } from '@/types/playlists'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PlaylistsTable({
  initialData,
}: {
  initialData: IPlaylistsListResponse
}) {
  const router = useRouter()
  const observerRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  const { data, setSize, isValidating } =
    useSWRInfinite<IPlaylistsListResponse>(
      (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.next) {
          return null
        }
        return `/api/playlists/list?page=${pageIndex + 1}&limit=20`
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

  console.log(
    'files length:',
    data?.map((item) => item.results.map((file) => file.files?.length))
  )

  console.log(
    'data:',
    data?.map((item) => item.results)
  )

  return (
    <div
      style={{
        height: 600,
        overflowY: 'auto',
      }}
      ref={viewportRef}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          padding: '12px',
          background: '#fff',
          zIndex: 2,
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ fontSize: 14, color: '#111' }}>
          Нажмите строку, чтобы перейти к расшифровке плейлиста
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <Table striped highlightOnHover>
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
              >
                <Table.Td>{playlist.name}</Table.Td>
                <Table.Td>{playlist.description || '-'}</Table.Td>
                <Table.Td>{playlist.files_count}</Table.Td>
                <Table.Td>{playlist.created || '-'}</Table.Td>
              </Table.Tr>
            ))}
            {isValidating && (
              <Table.Tr>
                <Table.Td colSpan={4}>
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
