import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import BreadcrumbsSetter from '@/components/ui/breadcrumbs/BreadcrumbsSetter'
import LoaderSkeleton from '@/components/ui/loader/LoaderSkeleton'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
import { IBrandListResponse } from '@/types/brands'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Hero } from './components/Hero'
import { Intro } from './components/Intro'
import { BrandCategories } from './components/BrandCategories'
import { BrandsFilterPanel } from './components/BrandsFilterPanel'
import { PopularFormats } from './components/PopularFormats'
import { CTABrands } from './components/CTABrands'
import { SEOTextBrands } from './components/SEOTextBrands'
import { FAQBrands } from './components/FAQBrands'

interface BrandsPageProps {
  searchParams: Promise<{
    limit?: string
    offset?: string
    search?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Бренды мест для размещения indoor-рекламы | «RMC»',
    description:
      'Каталог брендов торговых центров, сетей и площадок, где доступно размещение аудио- и видеорекламы.',
  }
}

const BrandWrapper = dynamic(
  () =>
    import('@/components/brands/BrandsWrapper').then((mod) => ({
      default: mod.BrandsWrapper,
    })),
  {
    ssr: true,
    loading: () => <LoaderSkeleton />,
  }
)

export default async function BrandsPage(props: BrandsPageProps) {
  const searchParams = await props.searchParams
  const limit = Number(searchParams.limit) || 15
  const offset = Number(searchParams.offset) || 0
  const searchQuery = searchParams.search || ''

  try {
    const url = new URL('/api/brands/assigned', process.env.API_1C_URL)
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('offset', String(offset))
    if (searchQuery) {
      url.searchParams.set('search', searchQuery)
      url.searchParams.set('page', '1') // Сбросить пагинацию при новом поисковом запросе
    }

    const response = await fetch(url.toString(), { cache: 'no-store' })

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`)
    }

    const data: IBrandListResponse = await response.json()

    const breadcrumbItems = [
      { name: 'Главная', url: SITE_URL },
      { name: 'Бренды мест', url: `${SITE_URL}/brands` },
    ]

    return (
      <>
        <BreadcrumbJsonLd items={breadcrumbItems} />
        <BreadcrumbsSetter title="Бренды мест" />

        <div className="bg-slate-50 text-slate-900 overflow-auto">
          <Hero totalBrands={data.count} minPrice={data.min_price} />
          <Intro />
          <BrandCategories />

          <section id="brands" className="bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-12">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                    Каталог брендов
                  </div>
                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    Выберите бренд для вашей рекламы
                  </h2>
                  <p className="mt-3 max-w-3xl text-slate-600">
                    Откройте карточку бренда, чтобы посмотреть доступные
                    рекламные места, адреса и условия размещения.
                  </p>
                </div>

                <div className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200">
                  Всего брендов:{' '}
                  <span className="text-[#ef5350]">{data.count}</span>
                </div>
              </div>

              <BrandsFilterPanel />

              <div className="mt-8 overflow-auto max-h-[calc(100vh-320px)]">
                <BrandWrapper
                  brandData={data.results}
                  count={data.count}
                  limit={limit}
                  offset={offset}
                />
              </div>
            </div>
          </section>

          <PopularFormats />
          <CTABrands />
          <SEOTextBrands />
          <FAQBrands />
        </div>
      </>
    )
  } catch (error) {
    console.error('Error fetching brands:', error)
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error('Произошла неизвестная ошибка')
    }
  }
}
