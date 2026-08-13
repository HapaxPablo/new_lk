import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, ListMusic } from 'lucide-react'
import { getPlaylistsList } from './api'
import PlaylistsTable from './components/PlaylistsTable'

export const metadata: Metadata = {
  title: 'Плейлисты',
  description: 'Список плейлистов',
}

const PlaylistsListPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ page: number; limit: number; name: string; search: string }>
}) => {
  const { page = 1, limit = 20, name = '', search = '' } = (await searchParams) ?? {}
  const listPlaylists = await getPlaylistsList({ page, limit, name, search: search || name })

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <Link href="/orders" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-900">
        <ChevronLeft size={17} /> К заказам
      </Link>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-violet-700">Медиатека</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Плейлисты</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Откройте плейлист, чтобы проверить состав файлов и быстро прослушать или посмотреть контент.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-sm font-medium text-violet-800">
          <ListMusic size={17} /> Создаются из выбранных файлов
        </div>
      </div>
      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <PlaylistsTable initialData={listPlaylists} initialSearch={search || name} />
      </section>
    </div>
  )
}

export default PlaylistsListPage
