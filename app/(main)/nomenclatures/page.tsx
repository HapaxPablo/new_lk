import ErrorPage from '@/components/ui/error/ErrorPage'
import LoaderSkeleton from '@/components/ui/loader/LoaderSkeleton'
import { generateNomenclaturesListMetadata } from '@/lib/configs/config-meta/nomenclatures'
import { INomenclatureResponse } from '@/types/nomenclature'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

const Toolbar = dynamic(
  () =>
    import('../../../components/toolbar/Toolbar').then((mod) => ({
      default: mod.default,
    })),
  {
    ssr: true,
    loading: () => <LoaderSkeleton />,
  }
)
const NomenclatureWrapper = dynamic(
  () =>
    import('../../../components/nomenclatures/NomenclatureWrapper').then(
      (mod) => ({
        default: mod.NomenclatureWrapper,
      })
    ),
  {
    ssr: true,
    loading: () => <LoaderSkeleton />,
  }
)
interface NomenclaturesPageProps {
  searchParams: Promise<{
    limit?: string
    page?: string
    search?: string
    brand_name?: string
    brand_id?: string
    status?: string
  }>
}
export async function generateMetadata(
  props: NomenclaturesPageProps
): Promise<Metadata> {
  const searchParams = await props.searchParams
  const search = searchParams.search || ''
  const brand_name = searchParams.brand_name || ''

  return generateNomenclaturesListMetadata({
    search,
    brand_name,
  })
}

export default async function NomenclaturesPage(props: NomenclaturesPageProps) {
  const searchParams = await props.searchParams
  const params = await searchParams
  const limit = Number(params.limit) || 24
  const page = Number(params.page) || 1
  const search = params.search || ''
  const brand_name = params.brand_name || ''
  const brand_id = params.brand_id || ''
  const status = params.status || ''

  const reset = () => {
    // Функция для повторной попытки (в клиентском компоненте)
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }
  // console.log('Page params:', { limit, page, search, brand_name, brand_id })

  try {
    // Формируем URL для API
    const url = new URL('/api/nomenclatures/', process.env.API_1C_URL)
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('page', String(page))
    if (search) url.searchParams.set('search', search)
    if (brand_name) url.searchParams.set('brand_name', brand_name)
    if (brand_id) url.searchParams.set('brand_id', brand_id)
    if (status) url.searchParams.set('status', status)

    // console.log('Making request to:', url.toString())

    const response = await fetch(url.toString())

    if (!response.ok) {
      // Получаем HTML от сервера
      const htmlContent = await response.text()

      // Проверяем, что это действительно HTML
      if (
        htmlContent.includes('<!DOCTYPE html>') ||
        htmlContent.includes('<html')
      ) {
        // Просто отображаем HTML как есть
        return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      }

      // Если это не HTML, выбрасываем ошибку
      // const error = new Error(`HTTP ${response.status}: ${response.statusText}`)
      // return <ErrorPage error={error} reset={reset} />
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const data: INomenclatureResponse = await response.json()
    return (
      <div className="flex flex-col h-full w-full p-1 gap-2">
        <h1 className="text-center text-2xl font-bold flex-shrink-0">
          Места размещения рекламы
        </h1>
        <Toolbar totalItems={data.count} currentLimit={limit} />

        <div className="flex-grow min-h-0 overflow-hidden">
          <div className="h-full">
            <NomenclatureWrapper
              nomenclatureData={data.results}
              limit={limit}
              page={page}
              count={data.count}
            />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching nomenclatures:', error)

    // Создаем объект ошибки для ErrorPage
    const errorObject =
      error instanceof Error ? error : new Error('Произошла неизвестная ошибка')
    return <ErrorPage error={errorObject} reset={reset} />
  }
}
