import { NomenclatureWrapper } from '@/components/nomenclatures/NomenclatureWrapper'
import { Pagination } from '@/components/pagination/Pagination'
import { SearchForm } from '@/components/search-form/SearchForm'
import { Button } from '@/components/ui/button/Button'
import { mockNomenclatureResponse } from '@/lib/mock/nomenclatureItem'
import { getToken } from '@/lib/token/getToken'
import { INomenclatureItem } from '@/types/nomenclature'

interface NomenclaturesPageProps {
  searchParams: {
    limit?: string
    offset?: string
    searchValue?: string
  }
}

export default async function NomenclaturesPage({
  searchParams,
}: NomenclaturesPageProps) {
  // Получаем параметры с await
  const params = await searchParams
  const limit = Number(params.limit) || 24
  const offset = Number(params.offset) || 0
  const search = params.searchValue || ''
  const token = await getToken()
  console.log('token nomen', token)

  try {
    // Формируем URL для API
    const url = new URL('/api/nomenclatures/', 'http://localhost:3000')
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('offset', String(offset))
    url.searchParams.set('searchValue', search)

    // Делаем запрос к API
    // const response = await fetch(url.toString(), {
    //   next: { tags: ['nomenclatures'] },
    //   credentials: 'include',
    //   headers: {
    //     Authorization: `xrmcCookie${token}`,
    //     Cookie: `xrmcCookie=${token}`,
    //   },
    // })

    // if (!response.ok) {
    //   const errorData = await response
    //   console.log('errorData', errorData)
    //   // throw new Error(errorData.error || 'Failed to fetch data')
    // }

    // const data: INomenclatureItem[] = await response.json()

    // Используем мок-данные вместо fetch
    const start = offset
    const end = offset + limit
    const data: INomenclatureItem[] = mockNomenclatureResponse.items.slice(
      start,
      end
    )
    const total = mockNomenclatureResponse.total

    // console.log('INomenclatureResponse', data)
    // console.log('NomenclatureList length:', data.length)

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Номенклатура</h1>

        <SearchForm initialSearch={search} className="mb-6" />
        {/* TODO: потом убрать */}
        <div className="flex flex-row gap-2 mb-2">
          <Button variant="default" type="button" className="text-nowrap">
            По бренду
          </Button>
          <Button variant="default" type="button" className="text-nowrap">
            По адресу
          </Button>
          <Button variant="default" type="button" className="text-nowrap">
            По атриклу
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {data?.length ? (
            <>
              <NomenclatureWrapper nomenclatureData={data} />
            </>
          ) : (
            <div>Nothing</div>
          )}
        </div>

        <Pagination limit={limit} offset={offset} total={total} />
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
