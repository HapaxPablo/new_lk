import { IClientOption } from '../../../../components/orders/supporting-components/ClientsMultiSelect'
import { IPlaylistOption } from '../../../../components/orders/supporting-components/PlaylistSelect'

const PLAYLIST_PAGE_LIMIT = 15
const CLIENT_PAGE_LIMIT = 20

const pad2 = (value: number) => String(value).padStart(2, '0')

export const formatDateForApi = (value: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(
    date.getHours()
  )}:${pad2(date.getMinutes())}:00`
}

async function fetchPage<T>(
  url: URL,
  mapItem: (raw: any) => T
): Promise<{ results: T[]; next: string | null }> {
  const response = await fetch(url.toString(), {
    credentials: 'include',
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.error || errorData?.message || 'Не удалось загрузить данные'
    )
  }

  const data = await response.json()
  return { results: (data.results || []).map(mapItem), next: data.next || null }
}

export const fetchPlaylistsPage = (page: number, search: string) => {
  const url = new URL('/api/playlists/list', window.location.origin)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(PLAYLIST_PAGE_LIMIT))
  if (search) url.searchParams.set('name', search)
  return fetchPage<IPlaylistOption>(url, (item) => ({
    id: item.id,
    name: item.name || item.id,
  }))
}

export const fetchClientsPage = (page: number, search: string) => {
  const url = new URL('/api/nomenclatures/', window.location.origin)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(CLIENT_PAGE_LIMIT))
  if (search) url.searchParams.set('search', search)
  return fetchPage<IClientOption>(url, (item) => ({
    id: item.id,
    name: item.name || item.nameForFront || item.id,
  }))
}
