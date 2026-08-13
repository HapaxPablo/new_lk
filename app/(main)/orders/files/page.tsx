import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, FileUp } from 'lucide-react'
import { getFilesList } from './api'
import FilesTable from './components/FilesTable'

export const metadata: Metadata = {
  title: 'Файлы',
  description: 'Библиотека файлов для заказов',
}

const FilesListPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{
    page: number
    limit: number
    name: string
    search: string
    file_type: string
    tags: string[]
  }>
}) => {
  const { page = 1, limit = 20, name = '', search = '', file_type = '', tags = [] } = (await searchParams) ?? {}
  const listFiles = await getFilesList({ page, limit, name, search: search || name, file_type, tags })

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <Link href="/orders" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-900">
        <ChevronLeft size={17} /> К заказам
      </Link>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700">Медиатека</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Файлы</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Выберите файлы и соберите из них плейлист для нового заказа.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800">
          <FileUp size={17} /> Загрузка доступна в списке ниже
        </div>
      </div>
      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <FilesTable initialData={listFiles} initialSearch={search || name} />
      </section>
    </div>
  )
}

export default FilesListPage
