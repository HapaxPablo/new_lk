import PageDevelop from '@/components/page-development/PageDevelop'
import { generateMyPlaceMetadata } from '@/lib/configs/config-meta/nomenclatures/generateMyPlaceMetadata'
import { Metadata } from 'next'
interface MyPlacePageProps {
  searchParams: Promise<{
    limit?: string
    page?: string
    name?: string
    brand_name?: string
    brand_id?: string
  }>
}
export async function generateMetadata(
  props: MyPlacePageProps
): Promise<Metadata> {
  const searchParams = await props.searchParams
  const search = searchParams.name || ''
  const brand_name = searchParams.brand_name || ''

  return generateMyPlaceMetadata({
    search,
    brand_name,
  })
}

export const metadata: Metadata = {
  title: 'Мое место | Личный кабинет',
  robots: {
    index: false,  // ← Исключить из индексации
    follow: true,
  },
}

export default async function NomenclaturesPage(props: MyPlacePageProps) {
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
    const url = new URL('/api/my-place/', process.env.API_1C_URL)
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('page', String(page))
    if (search) url.searchParams.set('name', search)
    if (brand_name) url.searchParams.set('brand_name', brand_name)
    if (brand_id) url.searchParams.set('brand_id', brand_id)

    // console.log('Making request to:', url.toString())

    // const response = await fetch(url.toString())

    // if (!response.ok) {
    //   const errorText = await response.text()
    //   console.error('API error:', response.status, errorText)
    //   throw new Error(`Failed to fetch data: ${response.status}`)
    // }

    // const data: INomenclatureResponse = await response.json()
    // console.log('API response received, count:', data.count)
    // console.log('Filtered by brand_name:', brand_name)
    // console.log('First item:', data.results)

    return <PageDevelop />
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
