import LoaderSkeleton from '@/components/ui/loader/LoaderSkeleton'
import { httpClient1CServer } from '@/lib/http-client/httpServer'
import { IGroupedTenantsResponse } from '@/types/tenants'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import dynamic from 'next/dynamic'
import { EcommerceTracker } from '@/components/ecommerce/EcommerceTracker'
import PageDevelop from '@/components/page-development/PageDevelop'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import BreadcrumbsSetter from '@/components/ui/breadcrumbs/BreadcrumbsSetter'

const Toolbar = dynamic(
  () =>
    import('@/components/toolbar/tenants/ToolbarTenants').then((mod) => ({
      default: mod.default,
    })),
  {
    ssr: true,
    loading: () => <LoaderSkeleton />,
  }
)

const TenantsWrapper = dynamic(
  () =>
    import('@/components/tenants/TenantsWrapper').then((mod) => ({
      default: mod.TenantsWrapper,
    })),
  {
    ssr: true,
    loading: () => <LoaderSkeleton />,
  }
)

interface TenantsPageProps {
  searchParams: Promise<{
    limit?: string
    offset?: string
    search?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Арендаторы | Личный кабинет',
    description: 'Список арендаторов',
  }
}

export default async function TenantsPage(props: TenantsPageProps) {
  const searchParams = await props.searchParams
  const limit = Number(searchParams.limit) || 15
  const offset = Number(searchParams.offset) || 0
  const search = searchParams.search || ''

  try {
    const cookieStore = await cookies()

    const queryString = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
      ...(search && { search }),
    }).toString()

    const data = await httpClient1CServer.get<IGroupedTenantsResponse>(
      cookieStore,
      `api/tenants/grouped/?${queryString}`
    )

    const breadcrumbItems = [
      { name: 'Главная', url: SITE_URL },
      { name: 'Арендаторы', url: `${SITE_URL}/tenants` },
    ]

    return (
      <>
        <EcommerceTracker
          item={{
            item_id: 'tenants-list',
            item_name: 'Список арендаторов',
            price: '',
          }}
        />
        <BreadcrumbJsonLd items={breadcrumbItems} />
        <BreadcrumbsSetter title="Арендаторы" />
        <div className="flex h-full w-full flex-col gap-2 p-1">
          <h1 className="ml-4 mb-3 text-xl! font-semibold md:text-2xl">
            Арендаторы
          </h1>
          <Toolbar totalItems={data.count} />
          <div className="grow min-h-0 overflow-hidden">
            <div className="h-full">
              <TenantsWrapper
                tenantsData={data.results}
                count={data.count}
                limit={limit}
              />
            </div>
          </div>
        </div>
      </>
    )
  } catch (error) {
    console.error('Error fetching tenants:', error)
    throw error
  }
}
// export default async function TenantsPage() {
//   return <PageDevelop /
// }