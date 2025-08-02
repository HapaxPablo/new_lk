import { NomenclatureWrapper } from '@/components/nomenclatures/NomenclatureWrapper'
import { Pagination } from '@/components/pagination/Pagination'
import { Button } from '@/components/ui/button/Button'
import { mockNomenclatureResponse } from '@/lib/mock/nomenclatureItem'
import { getToken } from '@/lib/token/getToken'
import { INomenclatureItem, INomenclatureResponse } from '@/types/nomenclature'
import { Metadata } from 'next'
interface NomenclaturesPageProps {
  searchParams: {
    limit?: string
    page?: string
    searchValue?: string
  }
}
export async function generateMetadata({
  searchParams,
}: NomenclaturesPageProps): Promise<Metadata> {
  const search = searchParams.searchValue || ''

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

export default async function NomenclaturesPage({
  searchParams,
}: NomenclaturesPageProps) {
  // Получаем параметры с await
  const params = await searchParams
  const limit = Number(params.limit) || 24
  const page = Number(params.page) || 1
  const search = params.searchValue || ''
  const token = await getToken()
  console.log('token nomen', token)

  try {
    // Формируем URL для API
    const url = new URL('/api/nomenclatures/', 'http://localhost:3000')
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('page', String(page))
    url.searchParams.set('searchValue', search)

    // Делаем запрос к API
    const response = await fetch(url.toString(), {
      next: { tags: ['nomenclatures'] },
      credentials: 'include',
      headers: {
        Authorization: `xrmcCookie${token}`,
        Cookie: `xrmcCookie=${token}`,
      },
    })

    if (!response.ok) {
      const errorData = response
      throw new Error(errorData.statusText|| 'Failed to fetch data')
    }
    const data: INomenclatureResponse = await response.json()

    console.log('INomenclatureResponse', data)
    return (
      <div className="container mx-auto px-1 py-2">
        <h1 className="text-2xl font-bold mb-6">Места размещения рекламы</h1>
        {/* TODO: доработать компонент с быстрыи настройками, в метод получения номенклатур добавить
        параметры для сортировок */}
        <div className="flex flex-row gap-2 mb-2">
          <Button variant="default" type="button" className="text-nowrap">
            По бренду
          </Button>
          <Button variant="default" type="button" className="text-nowrap">
            По адресу
          </Button>
          <Button variant="default" type="button" className="text-nowrap">
            По артикулу
          </Button>
        </div>

        {data?.results?.length ? (
          <NomenclatureWrapper nomenclatureData={data.results} />
        ) : (
          <div>Nothing</div> //TODO: придумать страницу ошибки и обработку ошибки нет данных
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
