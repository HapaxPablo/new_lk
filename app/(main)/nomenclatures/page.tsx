import { NomenclatureCard } from '@/components/nomenclatures/card/mobile/CardMobile'
import { Pagination } from '@/components/pagination/Pagination'
import { SearchForm } from '@/components/search-form/SearchForm'
import { getToken } from '@/lib/token/getToken'
import { INomenclatureItem } from '@/types/nomenclature'

interface NomenclaturesPageProps {
  searchParams: {
    limit?: string
    offset?: string
    search?: string
  }
}

export default async function NomenclaturesPage({
  searchParams,
}: NomenclaturesPageProps) {
  // Получаем параметры с await
  const params = await searchParams
  const limit = Number(params.limit) || 18
  const offset = Number(params.offset) || 0
  const search = params.search || undefined
  const token = await getToken()

  console.log('token nomen', token)

  try {
    // Формируем URL для API
    const url = new URL('/api/nomenclatures/', 'http://localhost:3000')
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('offset', String(offset))
    if (search) url.searchParams.set('search', search)

    // Делаем запрос к API
    const response = await fetch(url.toString(), {
      next: { tags: ['nomenclatures'] },
      // credentials: 'include',
      // headers: {
      //   Authorization: `xrmcCookie=${token}`,
      //   Cookie: `xrmcCookie=${token}`,
      // },
    })

    if (!response.ok) {
      const errorData = await response
      console.log('errorData', errorData)
      // throw new Error(errorData.error || 'Failed to fetch data')
    }

    const data: INomenclatureItem[] = await response.json()

    console.log('INomenclatureResponse', data)
    console.log('NomenclatureList length:', data.length)

    // Используем мок-данные вместо fetch
    // const data: INomenclatureItem[] = pagedData

    // console.log('INomenclatureResponse', data)
    // console.log('NomenclatureList length:', data.length)

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Номенклатура</h1>

        <SearchForm initialSearch={search} className="mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {data?.length ? (
            data.map((item) => <NomenclatureCard key={item.code} item={item} />)
          ) : (
            <div>Nothing</div>
          )}
        </div>

        <Pagination limit={limit} offset={offset} total={50} />
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
