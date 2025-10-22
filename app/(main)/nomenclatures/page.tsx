import { NomenclatureWrapper } from '@/components/nomenclatures/NomenclatureWrapper'
import { Pagination } from '@/components/pagination/Pagination'
import Toolbar from '@/components/toolbar/Toolbar'
import { getToken } from '@/lib/token/getToken'
import { INomenclatureResponse } from '@/types/nomenclature'
import { Metadata } from 'next'
interface NomenclaturesPageProps {
  searchParams: Promise<{
    limit?: string
    page?: string
    name?: string
    brand_name?: string
  }>
}
export async function generateMetadata(
  props: NomenclaturesPageProps
): Promise<Metadata> {
  const searchParams = await props.searchParams
  const search = searchParams.name || ''

  return {
    title: search
      ? `Поиск: "${search}" | Каталог номенклатуры`
      : 'Каталог номенклатуры | RMC',
    description: search
      ? `Результаты поиска по запросу "${search}" в каталоге номенклатуры`
      : 'Просмотрите наш полный каталог номенклатуры. Найдите нужные товары и материалы.',
    keywords: search
      ? [
        `поиск ${search}`,
        'номенклатура',
        'каталог',
        'места размещения рекламы',
        ...search.split(' '),
      ]
      : [
        'номенклатура',
        'каталог',
        'товары',
        'материалы',
        'места размещения рекламы',
      ],
    openGraph: {
      title: search
        ? `Поиск: "${search}" | Каталог номенклатуры`
        : 'Каталог номенклатуры | RMC',
      description: search
        ? `Результаты поиска по запросу "${search}" в каталоге номенклатуры`
        : 'Просмотрите наш полный каталог номенклатуры и , мест размещения рекламы',
      url: search
        ? `https://lk.krasrm.com/nomenclatures?searchValue=${encodeURIComponent(search)}`
        : //TODO вынести урл сайт в переменные использовать их
        'https://lk.krasrm.com/nomenclatures',
      siteName: 'RMC',
      images: [
        {
          url: 'https://krasrm.com/og-logo.jpg',
          width: 1200,
          height: 630,
        },
      ],
      locale: 'ru_RU',
      type: 'website',
    },
    alternates: {
      canonical: 'https://krasrm.com/nomenclatures',
    },
  }
}

export default async function NomenclaturesPage(props: NomenclaturesPageProps) {
  const searchParams = await props.searchParams
  const params = await searchParams
  const limit = Number(params.limit) || 24
  const page = Number(params.page) || 1
  const search = params.name || ''
  const brand_name = params.brand_name || ''
  
  console.log('Page params:', { limit, page, search, brand_name })

  try {
    // Формируем URL для API
    const url = new URL('/api/nomenclatures/', process.env.API_1C_URL)
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('page', String(page))
    if (search) url.searchParams.set('name', search)
    if (brand_name) url.searchParams.set('brand_name', brand_name)

    console.log('Making request to:', url.toString())

    const response = await fetch(url.toString())

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error:', response.status, errorText)
      throw new Error(`Failed to fetch data: ${response.status}`)
    }

    const data: INomenclatureResponse = await response.json()
    console.log('API response received, count:', data.count)
    console.log('Filtered by brand_name:', brand_name)
    console.log('First item:', data.results[0])

    return (
      <div className="container mx-auto px-1 py-2">
        <h1 className="text-2xl font-bold mb-6">Места размещения рекламы</h1>
        <Toolbar totalItems={data.count} currentLimit={limit} />
        {data.results.length > 0 ? (
          <NomenclatureWrapper nomenclatureData={data.results} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {brand_name ? 'Нет номенклатур для выбранного бренда' : 'Номенклатуры не найдены'}
            </p>
            {brand_name && (
              <p className="text-sm text-gray-400 mt-2">
                Бренд: {brand_name}
              </p>
            )}
          </div>
        )}
        <Pagination limit={limit} page={page} total={data.count} />
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