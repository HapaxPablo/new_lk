import { NomenclatureWrapper } from '@/components/nomenclatures/NomenclatureWrapper'
import Toolbar from '@/components/toolbar/Toolbar'
import { generateNomenclaturesListMetadata } from '@/lib/configs/config-meta/nomenclatures'
import { INomenclatureResponse } from '@/types/nomenclature'
import { Metadata } from 'next'
interface NomenclaturesPageProps {
  searchParams: Promise<{
    limit?: string
    page?: string
    name?: string
    brand_name?: string
    brand_id?: string
  }>
}
export async function generateMetadata(
  props: NomenclaturesPageProps
): Promise<Metadata> {
  const searchParams = await props.searchParams
  const search = searchParams.name || ''
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
  const search = params.name || ''
  const brand_name = params.brand_name || ''
  const brand_id = params.brand_id || ''

  // console.log('Page params:', { limit, page, search, brand_name, brand_id })

  try {
    // Формируем URL для API
    const url = new URL('/api/nomenclatures/', process.env.API_1C_URL)
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('page', String(page))
    if (search) url.searchParams.set('name', search)
    if (brand_name) url.searchParams.set('brand_name', brand_name)
    if (brand_id) url.searchParams.set('brand_id', brand_id)

    // console.log('Making request to:', url.toString())

    const response = await fetch(url.toString())

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error:', response.status, errorText)
      throw new Error(`Failed to fetch data: ${response.status}`)
    }

    const data: INomenclatureResponse = await response.json()
    // console.log('API response received, count:', data.count)
    // console.log('Filtered by brand_name:', brand_name)
    console.log('First item:', data.results)

    return (
      <div className="flex flex-col h-full w-full p-1 gap-2">
        <h1 className="text-center text-2xl font-bold flex-shrink-0">
          Места размещения рекламы
        </h1>
        <Toolbar totalItems={data.count} currentLimit={limit} />

        <div className="flex-grow min-h-0 overflow-hidden">
          {' '}
          {/* Контейнер для контента с ограничением высоты */}
          {data.results.length > 0 ? (
            <div className="h-full">
              <NomenclatureWrapper
                nomenclatureData={data.results}
                limit={limit}
                page={page}
                count={data.count}
              />
            </div>
          ) : (
            <div className="text-center py-8 h-full flex flex-col justify-center">
              <p className="text-gray-500">
                {brand_name
                  ? 'Нет номенклатур для выбранного бренда'
                  : 'Номенклатуры не найдены'}
              </p>
              {brand_name && (
                <p className="text-sm text-gray-400 mt-2">
                  Бренд: {brand_name}
                </p>
              )}
            </div>
          )}
        </div>

        {/* {data.results.length > 20 && (
        <div className="flex-shrink-0">
          <Pagination limit={limit} page={page} total={data.count} />
        </div>
      )} */}
      </div>
    )
  } catch (error) {
    console.error('Error fetching nomenclatures:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error instanceof Error ? error.message : 'Произошла ошибка'}
        </div>
      </div>
    )
  }
}
