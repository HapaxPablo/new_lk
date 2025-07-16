import { NomenclatureWrapper } from '@/components/nomenclatures/NomenclatureWrapper'
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

  // Мок-данные для тестирования UI
  const mockFio = [
    'Иванов И.И.',
    'Петров П.П.',
    'Сидоров С.С.',
    'Кузнецов К.К.',
    'Смирнов С.С.',
    'Попов П.П.',
    'Васильев В.В.',
    'Новиков Н.Н.',
    'Фёдоров Ф.Ф.',
    'Морозов М.М.',
    'Волков В.В.',
    'Алексеев А.А.',
    'Лебедев Л.Л.',
    'Семенов С.С.',
    'Егоров Е.Е.',
    'Павлов П.П.',
    'Козлов К.К.',
    'Степанов С.С.',
  ]
  // Генерируем 150 мок-элементов
  const mockData: INomenclatureItem[] = Array.from({ length: 150 }, (_, i) => ({
    code: `code${i + 1}`,
    name: `Номенклатура ${i + 1}`,
    isExample: i % 2 === 0,
    isOwn: i % 3 === 0 ? 'yes' : 'no',
    phoneNumber: `бренд${i + 1}`,
    ownerPlaces: mockFio[i % mockFio.length],
    articule: `00${(i + 1).toString().padStart(3, '0')}`,
    address: `г. Город, ул. Улица, д. ${(i % 50) + 1}`,
  }))

  const total = 150
  // Используем только нужный срез данных для текущей страницы
  const pagedData = mockData.slice(offset, offset + limit)

  try {
    //   // Формируем URL для API
    //   const url = new URL('/api/nomenclatures/', 'https://test.lk.krasrm.com')
    //   url.searchParams.set('limit', String(limit))
    //   url.searchParams.set('offset', String(offset))
    //   if (search) url.searchParams.set('search', search)

    //   // Делаем запрос к API
    //   const response = await fetch(url.toString(), {
    //     next: { tags: ['nomenclatures'] },
    //     credentials: 'include',
    //     headers: {
    //       Authorization: `xrmcCookie ${token}`,
    //       Cookie: `xrmcCookie=${token}`,
    //     },
    //   })

    //   if (!response.ok) {
    //     const errorData = await response.json()
    //     // console.log('errorData', errorData)
    //     throw new Error(errorData.error || 'Failed to fetch data')
    //   }

    //   const data: INomenclatureItem[] = await response.json()

    //   console.log('INomenclatureResponse', data)
    //   console.log('NomenclatureList length:', data.length)

    // Используем мок-данные вместо fetch
    const data: INomenclatureItem[] = pagedData

    // console.log('INomenclatureResponse', data)
    // console.log('NomenclatureList length:', data.length)

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Номенклатура</h1>

        <SearchForm initialSearch={search} className="mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {data?.length ? (
            data.map((item) => (
              <NomenclatureWrapper key={item.code} item={item} />
            ))
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
