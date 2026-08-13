import { EcommerceTracker } from '@/components/ecommerce/EcommerceTracker'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import BreadcrumbsSetter from '@/components/ui/breadcrumbs/BreadcrumbsSetter'
import LoaderSkeleton from '@/components/ui/loader/LoaderSkeleton'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
import { generateNomenclaturesListMetadata } from '@/lib/configs/config-meta/nomenclatures'
import { INomenclatureResponse } from '@/types/nomenclature'
import { CatalogSidebar } from '@/components/nomenclatures/CatalogSidebar'
import {
  NomenclaturesLandingSections,
  NomenclaturesSeoSections,
} from '@/components/nomenclatures/NomenclaturesLandingSections'
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
    city_slug?: string
  }>
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
  const citySlug = params.city_slug || ''

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
    if (citySlug) url.searchParams.set('city_slug', citySlug)

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
        <div className="h-full w-full overflow-y-auto bg-slate-50 text-slate-900">
          <NomenclaturesLandingSections totalItems={data.count} />

          <section id="catalog" className="border-y border-slate-200 bg-slate-50">
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
                  cityName={citySlug || undefined}
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
