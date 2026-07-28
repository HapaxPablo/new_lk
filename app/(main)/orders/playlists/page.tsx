import { Metadata } from 'next'
import { getPlaylistsList } from './api'
import PlaylistsTable from './components/PlaylistsTable'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Плейлисты',
  description: 'Список плейлистов',
}

const PlaylistsListPage = async ({
  searchParams,
}: {
  searchParams?: {
    page: number
    limit: number
    name: string
  }
}) => {
  const { page = 1, limit = 20, name = '' } = (await searchParams) ?? {}
  const listPlaylists = await getPlaylistsList({ page, limit, name })

  return (
    <div className="p-6">
      <Link href="/orders" className="text-sm text-blue-600!">
        Назад к заказам
      </Link>
      <h1>Плейлисты</h1>
      <div className="overflow-auto">
        <PlaylistsTable initialData={listPlaylists} />
      </div>
    </div>
  )
}

export default PlaylistsListPage
