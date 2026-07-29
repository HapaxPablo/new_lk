import Link from 'next/link'
import { Metadata } from 'next'
import { getPlaylistDetail } from '@/app/(main)/orders/playlists/api'
import { IPlaylistDetailResponse } from '@/types/playlists'
import { PlaylistDetailPreview } from '../components/PlaylistDetailPreview'

interface PlaylistPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params,
}: PlaylistPageProps): Promise<Metadata> {
  const playlist = await getPlaylistDetail(params.id)
  return {
    title: `Расшифровка плейлиста ${playlist.name}`,
  }
}

export default async function PlaylistDetailPage({
  params,
}: PlaylistPageProps) {
  let playlist: IPlaylistDetailResponse | null = null
  let errorMessage = ''

  try {
    playlist = await getPlaylistDetail(params.id)
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : 'Не удалось загрузить информацию о плейлисте'
  }

  return (
    <div className="p-6">
      {errorMessage ? (
        <div className="text-red-600">{errorMessage}</div>
      ) : playlist ? (
        <div className="space-y-6">
          <Link href="/orders/playlists">Назад к плейлистам</Link>
          <div className="space-y-2 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {playlist.name}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {playlist.description || 'Описание отсутствует'}
                </p>
              </div>
              <div className="grid gap-2 text-sm text-gray-600 sm:text-right">
                <div>
                  <span className="font-medium text-gray-900">Создано: </span>
                  {playlist.created || '-'}
                </div>
                <div>
                  <span className="font-medium text-gray-900">Автор: </span>
                  {playlist.owner?.full_name || '-'}
                </div>
                <div>
                  <span className="font-medium text-gray-900">Файлов: </span>
                  {playlist.files_count ?? playlist.files?.length ?? 0}
                </div>
              </div>
            </div>
          </div>

          {playlist.files && playlist.files.length > 0 ? (
            <PlaylistDetailPreview files={playlist.files} />
          ) : (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
              Файлы не найдены в плейлисте.
            </div>
          )}
        </div>
      ) : (
        <div>Загрузка...</div>
      )}
    </div>
  )
}
