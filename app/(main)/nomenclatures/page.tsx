import { EcommerceTracker } from '@/components/ecommerce/EcommerceTracker'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import BreadcrumbsSetter from '@/components/ui/breadcrumbs/BreadcrumbsSetter'
import LoaderSkeleton from '@/components/ui/loader/LoaderSkeleton'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
import { generateNomenclaturesListMetadata } from '@/lib/configs/config-meta/nomenclatures'
import {
  INomenclatureMapResponse,
  INomenclatureResponse,
} from '@/types/nomenclature'
import { type PopularCity } from '@/lib/api/geocoding'
import { CatalogSidebar } from '@/components/nomenclatures/CatalogSidebar'
import {
  NomenclaturesLandingSections,
  NomenclaturesSeoSections,
} from '@/components/nomenclatures/NomenclaturesLandingSections'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { cookies } from 'next/headers'

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
    counterparty_id?: string
    status?: string
    type_of_place?: string
    city_slug?: string
    content_types?: string
    price_from?: string
    price_to?: string
    has_facade?: string
  }>
}

function getCatalogSearchBody(params: {
  limit: number
  page: number
  search: string
  brand_name: string
  brand_id: string
  counterparty_id: string
  status: string
  type_of_place: string
  city_slug: string
  content_types: string
  price_from: string
  price_to: string
  has_facade: string
}) {
  const body: Record<string, string | number | boolean | string[]> = {
    limit: params.limit,
    page: params.page,
  }

  if (params.search) body.search = params.search
  if (params.brand_name) body.brand_name = params.brand_name
  if (params.brand_id) {
    const brandIds = params.brand_id.split(',').filter(Boolean)
    if (brandIds.length > 1) {
      body.brand_ids = brandIds
    } else {
      body.brand_id = brandIds[0]
    }
  }
  if (params.counterparty_id) {
    const counterpartyIds = params.counterparty_id.split(',').filter(Boolean)
    if (counterpartyIds.length > 1) {
      body.counterparty_ids = counterpartyIds
    } else {
      body.counterparty_id = counterpartyIds[0]
    }
  }
  if (params.status) body.status = params.status
  if (params.type_of_place) body.type_of_place = params.type_of_place
  if (params.city_slug) body.city_slug = params.city_slug
  if (params.content_types) {
    body.content_types = params.content_types
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  }
  if (params.price_from) body.price_from = params.price_from
  if (params.price_to) body.price_to = params.price_to
  if (params.has_facade === 'true' || params.has_facade === 'false') {
    body.has_facade = params.has_facade === 'true'
  }

  return body
}
export async function generateMetadata(
  props: NomenclaturesPageProps
): Promise<Metadata> {
  const searchParams = await props.searchParams
  const search = searchParams.search || ''
  const brand_name = searchParams.brand_name || ''
  const hasQueryParameters = Object.values(searchParams).some(
    (value) => typeof value === 'string' && value.length > 0
  )

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
    robots: {
      index: !hasQueryParameters,
      follow: true,
    },
  }
}

async function getPopularCities(): Promise<PopularCity[]> {
  try {
    const url = new URL('/api/cities/popular/', process.env.API_1C_URL)
    const response = await fetch(url.toString(), {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching popular cities:', error)
    return []
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
  const counterpartyId = params.counterparty_id || ''
  const status = params.status || ''
  const typeOfPlace = params.type_of_place || ''
  const citySlug = params.city_slug || ''
  const contentTypes = params.content_types || ''
  const priceFrom = params.price_from || ''
  const priceTo = params.price_to || ''
  const hasFacade = params.has_facade || ''
  const token = (await cookies()).get('access_token')?.value
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `access_token ${token}`
    headers.Cookie = `access_token=${token}`
  }

  // console.log('Page params:', { limit, page, search, brand_name, brand_id })
  try {
    const searchBody = getCatalogSearchBody({
      limit,
      page,
      search,
      brand_name,
      brand_id,
      counterparty_id: counterpartyId,
      status,
      type_of_place: typeOfPlace,
      city_slug: citySlug,
      content_types: contentTypes,
      price_from: priceFrom,
      price_to: priceTo,
      has_facade: hasFacade,
    })
    const searchUrl = new URL(
      '/api/nomenclatures/web/search/',
      process.env.API_1C_URL
    )
    const mapUrl = new URL('/api/nomenclatures/web/map/', process.env.API_1C_URL)

    const [response, mapResponse, popularCities] = await Promise.all([
      fetch(searchUrl.toString(), {
        method: 'POST',
        cache: 'no-store',
        headers: headers,
        body: JSON.stringify(searchBody),
      }),
      fetch(mapUrl.toString(), {
        method: 'POST',
        cache: 'no-store',
        headers: headers,
        body: JSON.stringify(searchBody),
      }),
      getPopularCities(),
    ])

    if (!response.ok) {
      throw new Error(
        `Ошибка ${response.status}: ${await response.text() || response.statusText}`
      )
    }
    if (!mapResponse.ok) {
      throw new Error(
        `Ошибка карты ${mapResponse.status}: ${await mapResponse.text() || mapResponse.statusText}`
      )
    }

    const searchData: Omit<INomenclatureResponse, 'next' | 'previous'> & {
      next_page: number | null
      previous_page: number | null
    } = await response.json()
    const data: INomenclatureResponse = {
      ...searchData,
      next: searchData.next_page === null ? null : String(searchData.next_page),
      previous:
        searchData.previous_page === null
          ? null
          : String(searchData.previous_page),
    }
    const mapData: INomenclatureMapResponse = await mapResponse.json()

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
        <div className="h-full w-full overflow-y-auto bg-slate-50 text-slate-900">
          <NomenclaturesLandingSections
            totalItems={data.count}
            popularCities={popularCities}
          />

          <section
            id="catalog"
            className="border-y border-slate-200 bg-slate-50"
          >
            <div className="mx-auto max-w-7xl px-4 py-12">
              <div className="mb-6 max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                  Каталог площадок
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  Выберите места для вашей рекламы
                </h2>
                <p className="mt-2 text-slate-600">
                  Поиск, фильтры и список площадок работают в отдельной
                  прокручиваемой области.
                </p>
              </div>

              <div className="space-y-6">
                <div className="h-[clamp(38rem,calc(100svh-7rem),48rem)]">
                  <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                    <Toolbar totalItems={data.count} variant="catalog" />
                    <div className="mt-3 min-h-0 grow">
                      <NomenclatureWrapper
                        nomenclatureData={data.results}
                        limit={limit}
                        page={page}
                        count={data.count}
                      />
                    </div>
                  </div>
                </div>
                <CatalogSidebar
                  items={data.results}
                  mapItems={mapData.results}
                />
              </div>
            </div>
          </section>

          <NomenclaturesSeoSections />
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
