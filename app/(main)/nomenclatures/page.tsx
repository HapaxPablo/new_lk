import { EcommerceTracker } from '@/components/ecommerce/EcommerceTracker'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import BreadcrumbsSetter from '@/components/ui/breadcrumbs/BreadcrumbsSetter'
import LoaderSkeleton from '@/components/ui/loader/LoaderSkeleton'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
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
    type_of_place?: string
  }>
}
export async function generateMetadata(
  props: NomenclaturesPageProps
): Promise<Metadata> {
  const searchParams = await props.searchParams
  const search = searchParams.search || ''
  const brand_name = searchParams.brand_name || ''

  const metadata = generateNomenclaturesListMetadata({
    search,
    brand_name,
  })

  // Canonical URL для основного списка (без фильтров)
  const canonicalUrl = `${SITE_URL}/nomenclatures`

  return {
    ...metadata,
    alternates: {
      canonical: canonicalUrl,
    },
  }
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
  const typeOfPlace = params.type_of_place || ''

  // console.log('Page params:', { limit, page, search, brand_name, brand_id })
  try {
    const url = new URL('/api/nomenclatures/', process.env.API_1C_URL)
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('page', String(page))
    if (search) url.searchParams.set('search', search)
    if (brand_name) url.searchParams.set('brand_name', brand_name)
    if (brand_id) url.searchParams.set('brand_id', brand_id)
    if (status) url.searchParams.set('status', status)
    if (typeOfPlace) url.searchParams.set('type_of_place', typeOfPlace)

    // console.log('Making request to:', url.toString())

    const response = await fetch(url.toString(), { cache: 'no-cache' })

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`)
    }

    const data: INomenclatureResponse = await response.json()

    const breadcrumbItems = [
      { name: 'Главная', url: SITE_URL },
      { name: 'Места для рекламы', url: `${SITE_URL}/nomenclatures` },
    ]

    return (
      <>
        <EcommerceTracker
          item={{
            item_id: 'nomenclatures-list',
            item_name: 'Список мест для радио-рекламы',
            price: '',
          }}
        />
        <BreadcrumbJsonLd items={breadcrumbItems} />
        <BreadcrumbsSetter title="Места для рекламы" />
        <div className="flex flex-col h-full w-full p-1 gap-2">
          <h1 className="text-xl! md:text-2xl ml-4 font-semibold mb-3">Выберите места для вашей радио-рекламы</h1>
          <Toolbar totalItems={data.count} />

          <div className="grow min-h-0 overflow-hidden">
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
      </>
    )
  } catch (error) {
    console.error('Error fetching nomenclatures:', error)
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error('Произошла неизвестная ошибка')
    }
  }
}
