'use client'
import { Table, Loader, Checkbox, Button, TextInput } from '@mantine/core'
import useSWRInfinite from 'swr/infinite'
import { useEffect, useRef, useState } from 'react'
import { IFilesListResponse } from '@/types/files'
import { ModalWrapper } from '@/components/modal/ModalWrapper'
import { useModal } from '@/providers/modal/ModalProvider'
import { useToast } from '@/hooks/useToast'
import { ModalAddFile } from './ModalAddFile/ModalAddFile'
import { useDebounce } from '@/hooks/useDebounce'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function FilesTable({
  initialData,
  initialSearch = '',
}: {
  initialData: IFilesListResponse
  initialSearch?: string
}) {
  const observerRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [selection, setSelection] = useState<string[]>([])
  const [playlistName, setPlaylistName] = useState('')
  const [playlistDescription, setPlaylistDescription] = useState('')
  const [searchInput, setSearchInput] = useState(initialSearch)
  const search = useDebounce(searchInput, 400)
  const playlistModal = useModal('playlist')
  const { showToast } = useToast()

  const { data, setSize, isValidating, mutate } =
    useSWRInfinite<IFilesListResponse>(
      (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.next) {
          return null
        }
        const params = new URLSearchParams({
          page: String(pageIndex + 1),
          limit: '20',
        })
        if (search) params.set('search', search)
        return `/api/files/list?${params.toString()}`
      },
      fetcher,
      { fallbackData: [initialData], revalidateFirstPage: false }
    )

  const files = data?.flatMap((page) => page.results) ?? []

  useEffect(() => {
    const element = observerRef.current
    const viewport = viewportRef.current

    if (!element || !viewport) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const hasMore = Boolean(data?.at(-1)?.next)

        if (entry.isIntersecting && hasMore && !isValidating) {
          setSize((prev) => prev + 1)
        }
      },
      { root: viewport, rootMargin: '200px 0px' }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [data, isValidating, setSize])

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )

  const toggleAll = () =>
    setSelection((current) =>
      current.length === files.length ? [] : files.map((item) => item.id)
    )

  const closePlaylistModal = () => {
    playlistModal.closeModal()
    setPlaylistName('')
    setPlaylistDescription('')
  }

  const handleCreatePlaylist = async () => {
    try {
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playlistName,
          description: playlistDescription,
          files: selection,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        showToast(result.error || 'Не удалось создать плейлист', 'error')
        return
      }

      showToast('Плейлист успешно создан', 'success')
      closePlaylistModal()
      setSelection([])
    } catch (error) {
      console.error('Playlist create error:', error)
      showToast('Ошибка при создании плейлиста', 'error')
    }
  }

  return (
    <div className="h-[600px] overflow-y-auto" ref={viewportRef}>
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
        <TextInput
          value={searchInput}
          onChange={(event) => setSearchInput(event.currentTarget.value)}
          placeholder="Поиск по названию файла или тэгу"
          aria-label="Поиск по файлам"
          mb="sm"
        />
        <ModalAddFile onSuccess={() => mutate()} />
        <div className="mt-3 grid gap-3">
          {selection.length > 0 && (
            <div className="flex flex-col justify-between gap-3 rounded-xl bg-blue-50 px-4 py-3 sm:flex-row sm:items-center">
              <div className="text-sm font-medium text-blue-900">
                {selection.length} выбран
                {selection.length === 1 ? 'ный' : 'ных'} файл
              </div>
              <Button onClick={playlistModal.openModal}>
                Создать плейлист
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <Table striped highlightOnHover className="min-w-[700px]">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }}>
                <Checkbox
                  checked={
                    selection.length > 0 && selection.length === files.length
                  }
                  indeterminate={
                    selection.length > 0 && selection.length < files.length
                  }
                  onChange={toggleAll}
                  styles={{ input: { borderWidth: 4, borderColor: 'black' } }}
                  size="md"
                />
              </Table.Th>
              <Table.Th>Название</Table.Th>
              <Table.Th>Размер</Table.Th>
              <Table.Th>Тип</Table.Th>
              <Table.Th>Теги</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {files.map((file) => {
              const isSelected = selection.includes(file.id)

              return (
                <Table.Tr
                  key={file.id}
                  onClick={() => toggleRow(file.id)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: isSelected
                      ? 'rgba(0, 131, 255, 0.08)'
                      : undefined,
                  }}
                  className="outline-none"
                >
                  <Table.Td>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleRow(file.id)}
                      onClick={(event) => event.stopPropagation()}
                    />
                  </Table.Td>
                  <Table.Td className="font-medium text-slate-800">
                    {file.name}
                  </Table.Td>
                  <Table.Td>{file.size}</Table.Td>
                  <Table.Td>{file.type}</Table.Td>
                  <Table.Td className="max-w-xs truncate text-slate-500">
                    {file.tags?.join(', ') || '—'}
                  </Table.Td>
                </Table.Tr>
              )
            })}
            {isValidating && (
              <Table.Tr>
                <Table.Td colSpan={5} className="py-4">
                  <Loader size="sm" />
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
        <div ref={observerRef} style={{ height: 1 }} />
      </div>
      <ModalWrapper id="playlist" title="Создать плейлист">
        <div style={{ display: 'grid', gap: 12 }}>
          <TextInput
            label="Название плейлиста"
            value={playlistName}
            onChange={(event) => setPlaylistName(event.currentTarget.value)}
            placeholder="Введите имя плейлиста"
          />

          <TextInput
            label="Описание плейлиста"
            value={playlistDescription}
            onChange={(event) =>
              setPlaylistDescription(event.currentTarget.value)
            }
            placeholder="Введите описание плейлиста"
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            <Button variant="outline" onClick={closePlaylistModal}>
              Отмена
            </Button>
            <Button
              onClick={handleCreatePlaylist}
              disabled={!playlistName.trim()}
            >
              Создать
            </Button>
          </div>
        </div>
      </ModalWrapper>
    </div>
  )
}
