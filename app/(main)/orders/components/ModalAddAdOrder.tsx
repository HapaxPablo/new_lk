'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button/Button'
import { ModalWrapper } from '@/components/modal/ModalWrapper'
import { useModal } from '@/providers/modal/ModalProvider'
import { useToast } from '@/hooks/useToast'

const broadcastTypes = [
  { value: '0', label: '0 — по режиму работы точки' },
  { value: '1', label: '1 — от начала работы + delta' },
  { value: '2', label: '2 — от delta до окончания' },
  { value: '3', label: '3 — конкретное время' },
  { value: '4', label: '4 — от начала до фиксированного времени' },
  { value: '5', label: '5 — от фиксированного времени до окончания' },
  { value: '6', label: '6 — по событию' },
]

const PLAYLIST_PAGE_LIMIT = 15
const CLIENT_PAGE_LIMIT = 20

const pad2 = (value: number) => String(value).padStart(2, '0')

const formatDateForApi = (value: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
    date.getDate()
  )} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:00`
}

const parseIds = (value: string) =>
  value
    .split(/[\n\r,]+/)
    .map((item) => item.trim())
    .filter(Boolean)

interface IPlaylistItem {
  id: string
  name: string
}

interface IClientItem {
  id: string
  name: string
}

const fetchPlaylistsPage = async (
  page: number,
  search: string
): Promise<{ results: IPlaylistItem[]; next: string | null }> => {
  const url = new URL('/api/playlists/list', window.location.origin)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(PLAYLIST_PAGE_LIMIT))
  if (search) url.searchParams.set('name', search)

  const response = await fetch(url.toString(), {
    credentials: 'include',
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.error || errorData?.message || 'Не удалось загрузить плейлисты'
    )
  }

  const data = await response.json()
  return {
    results: (data.results || []).map((item: any) => ({
      id: item.id,
      name: item.name || item.id,
    })),
    next: data.next || null,
  }
}

const fetchClientsPage = async (
  page: number,
  search: string
): Promise<{ results: IClientItem[]; next: string | null }> => {
  const url = new URL('/api/nomenclatures/', window.location.origin)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(CLIENT_PAGE_LIMIT))
  if (search) url.searchParams.set('search', search)

  const response = await fetch(url.toString(), {
    credentials: 'include',
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.error || errorData?.message || 'Не удалось загрузить клиентов'
    )
  }

  const data = await response.json()
  return {
    results: (data.results || []).map((item: any) => ({
      id: item.id,
      name: item.name || item.nameForFront || item.id,
    })),
    next: data.next || null,
  }
}

export function ModalAddAdOrder() {
  const adOrderModal = useModal('ad_order')
  const { showToast } = useToast()

  const [playlists, setPlaylists] = useState<IPlaylistItem[]>([])
  const [playlist, setPlaylist] = useState('')
  const [playlistSearch, setPlaylistSearch] = useState('')
  const [playlistPage, setPlaylistPage] = useState(1)
  const [playlistHasMore, setPlaylistHasMore] = useState(true)
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false)
  const [isPlaylistDropdownOpen, setIsPlaylistDropdownOpen] = useState(false)

  const [clients, setClients] = useState<IClientItem[]>([])
  const [selectedClients, setSelectedClients] = useState<IClientItem[]>([])
  const [clientSearch, setClientSearch] = useState('')
  const [clientPage, setClientPage] = useState(1)
  const [clientHasMore, setClientHasMore] = useState(true)
  const [isLoadingClients, setIsLoadingClients] = useState(false)
  const [isClientsDropdownOpen, setIsClientsDropdownOpen] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [broadcastType, setBroadcastType] = useState('0')
  const [lower, setLower] = useState('')
  const [upper, setUpper] = useState('')
  const [timesInHour, setTimesInHour] = useState('1')
  const [timedelta, setTimedelta] = useState('0')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [weight, setWeight] = useState('50')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const parameters = useMemo(() => {
    const params: Record<string, number | string> = {}
    if (weight) params.weight = Number(weight)
    if (timesInHour) params.times_in_hour = Number(timesInHour)
    if (timedelta) params.timedelta = Number(timedelta)
    if (startTime) params.start_time = startTime
    if (endTime) params.end_time = endTime
    return params
  }, [weight, timesInHour, timedelta, startTime, endTime])

  const playlistDropdownRef = useRef<HTMLDivElement | null>(null)
  const playlistObserverRef = useRef<HTMLDivElement | null>(null)
  const clientsDropdownRef = useRef<HTMLDivElement | null>(null)
  const clientsObserverRef = useRef<HTMLDivElement | null>(null)

  const resetForm = () => {
    setPlaylist('')
    setPlaylistSearch('')
    setPlaylistPage(1)
    setPlaylistHasMore(true)
    setPlaylists([])
    setIsPlaylistDropdownOpen(false)

    setSelectedClients([])
    setClientSearch('')
    setClientPage(1)
    setClientHasMore(true)
    setClients([])
    setIsClientsDropdownOpen(false)

    setName('')
    setDescription('')
    setBroadcastType('0')
    setLower('')
    setUpper('')
    setTimesInHour('1')
    setTimedelta('0')
    setStartTime('')
    setEndTime('')
    setWeight('50')
  }

  const isModalOpen = adOrderModal.isOpen

  const loadPlaylists = useCallback(
    async (page: number, search: string) => {
      setIsLoadingPlaylists(true)
      try {
        const data = await fetchPlaylistsPage(page, search)
        setPlaylists((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        )
        setPlaylistHasMore(Boolean(data.next))
      } catch (error) {
        console.error('Load playlists error:', error)
        showToast('Не удалось загрузить список плейлистов', 'error')
      } finally {
        setIsLoadingPlaylists(false)
      }
    },
    [showToast]
  )

  const loadClients = useCallback(
    async (page: number, search: string) => {
      setIsLoadingClients(true)
      try {
        const data = await fetchClientsPage(page, search)
        setClients((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        )
        setClientHasMore(Boolean(data.next))
      } catch (error) {
        console.error('Load clients error:', error)
        showToast('Не удалось загрузить список клиентов', 'error')
      } finally {
        setIsLoadingClients(false)
      }
    },
    [showToast]
  )

  useEffect(() => {
    if (!isModalOpen) return
    loadPlaylists(1, playlistSearch)
    loadClients(1, clientSearch)
  }, [isModalOpen, loadPlaylists, loadClients, playlistSearch, clientSearch])

  useEffect(() => {
    if (playlistPage === 1) return
    loadPlaylists(playlistPage, playlistSearch)
  }, [playlistPage, playlistSearch, loadPlaylists])

  useEffect(() => {
    if (clientPage === 1) return
    loadClients(clientPage, clientSearch)
  }, [clientPage, clientSearch, loadClients])

  useEffect(() => {
    const element = playlistObserverRef.current
    const container = playlistDropdownRef.current
    if (!element || !container || !playlistHasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlaylistPage((current) => current + 1)
        }
      },
      { root: container, rootMargin: '200px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [playlistHasMore])

  useEffect(() => {
    const element = clientsObserverRef.current
    const container = clientsDropdownRef.current
    if (!element || !container || !clientHasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setClientPage((current) => current + 1)
        }
      },
      { root: container, rootMargin: '200px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [clientHasMore])

  const toggleClient = (item: IClientItem) => {
    setSelectedClients((prev) => {
      if (prev.some((client) => client.id === item.id)) {
        return prev.filter((client) => client.id !== item.id)
      }
      return [...prev, item]
    })
  }

  const handleSubmit = async () => {
    if (!playlist.trim()) {
      showToast('Укажите playlist', 'error')
      return
    }

    if (selectedClients.length === 0) {
      showToast('Укажите хотя бы одного клиента', 'error')
      return
    }

    if (!name.trim()) {
      showToast('Укажите имя заказа', 'error')
      return
    }

    if (!lower || !upper) {
      showToast('Укажите интервал вещания', 'error')
      return
    }

    const body = {
      playlist: playlist.trim(),
      clients: selectedClients.map((client) => client.id),
      name: name.trim(),
      description: description.trim() || undefined,
      broadcast_interval: {
        lower: formatDateForApi(lower),
        upper: formatDateForApi(upper),
      },
      broadcast_type: Number(broadcastType),
      parameters,
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/adorders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (!response.ok) {
        showToast(result.error || 'Ошибка при создании AD заказа', 'error')
        return
      }

      showToast('AD заказ успешно создан', 'success')
      resetForm()
      adOrderModal.closeModal()
    } catch (error) {
      console.error('AD order create error:', error)
      showToast('Ошибка при создании AD заказа', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button onClick={adOrderModal.openModal}>Создать AD заказ</Button>
      <ModalWrapper id="ad_order" title="Создать AD заказ">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Playlist
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-900 outline-none transition focus:border-blue-500"
                onClick={() => setIsPlaylistDropdownOpen((prev) => !prev)}
              >
                {playlists.find((item) => item.id === playlist)?.name ||
                  'Выберите плейлист'}
              </button>
              {isPlaylistDropdownOpen && (
                <div className="absolute z-10 mt-2 w-full rounded-2xl border border-gray-200 bg-white shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <input
                      value={playlistSearch}
                      onChange={(event) => {
                        setPlaylistSearch(event.target.value)
                        setPlaylistPage(1)
                        setPlaylistHasMore(true)
                      }}
                      placeholder="Поиск плейлистов"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div
                    ref={playlistDropdownRef}
                    className="max-h-64 overflow-y-auto"
                  >
                    {playlists.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setPlaylist(item.id)
                          setIsPlaylistDropdownOpen(false)
                        }}
                        className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50"
                      >
                        <span>{item.name}</span>
                        {item.id === playlist && (
                          <span className="text-xs text-blue-600">✓</span>
                        )}
                      </button>
                    ))}
                    {isLoadingPlaylists && (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        Загружаем...
                      </div>
                    )}
                    <div ref={playlistObserverRef} className="h-1" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Clients</label>
            <div className="grid gap-2 rounded-2xl border border-gray-200 bg-white p-3">
              <div className="flex flex-wrap gap-2">
                {selectedClients.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleClient(item)}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <input
                value={clientSearch}
                onChange={(event) => {
                  setClientSearch(event.target.value)
                  setClientPage(1)
                  setClientHasMore(true)
                }}
                placeholder="Поиск клиентов"
                className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500"
              />
              <div
                ref={clientsDropdownRef}
                className="max-h-64 overflow-y-auto rounded-2xl border border-gray-100"
              >
                {clients.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleClient(item)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-gray-50 ${
                      selectedClients.some((client) => client.id === item.id)
                        ? 'bg-blue-50'
                        : ''
                    }`}
                  >
                    <span>{item.name}</span>
                    {selectedClients.some(
                      (client) => client.id === item.id
                    ) && <span className="text-xs text-blue-600">✓</span>}
                  </button>
                ))}
                {isLoadingClients && (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Загружаем...
                  </div>
                )}
                <div ref={clientsObserverRef} className="h-1" />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Название заказа
            </label>
            <input
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Наименование заказа"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Описание
            </label>
            <textarea
              className="min-h-20 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Необязательно"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Начало
              </label>
              <input
                type="datetime-local"
                className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                value={lower}
                onChange={(event) => setLower(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Окончание
              </label>
              <input
                type="datetime-local"
                className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                value={upper}
                onChange={(event) => setUpper(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Тип вещания
              </label>
              <select
                className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                value={broadcastType}
                onChange={(event) => setBroadcastType(event.target.value)}
              >
                {broadcastTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Приоритет (weight)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Выходов в час
              </label>
              <input
                type="number"
                min={0}
                max={100}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                value={timesInHour}
                onChange={(event) => setTimesInHour(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Delta (минут)
              </label>
              <input
                type="number"
                min={0}
                max={59}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                value={timedelta}
                onChange={(event) => setTimedelta(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Start/End time
              </label>
              <div className="grid gap-2">
                <input
                  type="time"
                  step="1"
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  placeholder="HH:MM:SS"
                />
                <input
                  type="time"
                  step="1"
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  placeholder="HH:MM:SS"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="default" onClick={adOrderModal.closeModal}>
              Отменить
            </Button>
            <Button onClick={handleSubmit} isLoading={isSubmitting}>
              Создать заказ
            </Button>
          </div>
        </div>
      </ModalWrapper>
    </>
  )
}
