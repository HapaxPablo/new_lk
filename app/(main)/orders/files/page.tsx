// import { PageWrapper } from '@/components/files/PageWrapper'
import { Metadata } from 'next'
import { getFilesList } from './api'
import FilesTable from './components/FilesTable'

export const metadata: Metadata = {
  title: 'Файлы',
  description: 'Список файлов',
}

const FilesListPage = async ({
  searchParams,
}: {
  searchParams?: {
    page: number
    limit: number
    name: string
    file_type: string
    tags: string[]
  }
}) => {
  const {
    page = 1,
    limit = 20,
    name = '',
    file_type = '',
    tags = [],
  } = (await searchParams) ?? {}

  const listFiles = await getFilesList({ page, limit, name, file_type, tags })
  const dataFiles = listFiles.results ? listFiles.results : []
  const countFiles = listFiles.count ? listFiles.count : 0
  console.log(countFiles)
  return (
    <div className="overflow-auto">
      <h1>Файлы</h1>
      <div className="overflow-auto">
        <FilesTable initialData={listFiles} />
      </div>
    </div>
  )
}

export default FilesListPage
