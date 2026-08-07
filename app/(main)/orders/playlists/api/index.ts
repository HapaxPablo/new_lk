import { httpClient1CServer } from '@/lib/http-client/httpServer'
import { cookies } from 'next/headers'
import {
  IPlaylistDetailResponse,
  IPlaylistsListResponse,
} from '@/types/playlists'

export async function getPlaylistsList(queryParams: {
  page: number
  limit: number
  name?: string
  search?: string
}): Promise<IPlaylistsListResponse> {
  const cookieStore = await cookies()
  const stringifiedQueryParams: Record<string, string | string[]> = {
    page: queryParams.page.toString(),
    limit: queryParams.limit.toString(),
  }

  const search = queryParams.search ?? queryParams.name
  if (search) {
    stringifiedQueryParams.search = search.toString()
  }

  const queryString = new URLSearchParams(
    stringifiedQueryParams as Record<string, string>
  ).toString()
  const data = await httpClient1CServer.get<IPlaylistsListResponse>(
    cookieStore,
    `api/playlists/?${queryString}`
  )

  return data
}

export async function getPlaylistDetail(
  playlistId: string
): Promise<IPlaylistDetailResponse> {
  const cookieStore = await cookies()
  return httpClient1CServer.get<IPlaylistDetailResponse>(
    cookieStore,
    `api/playlists/${playlistId}/`
  )
}
