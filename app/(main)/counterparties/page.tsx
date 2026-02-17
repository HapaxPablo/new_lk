import LoaderSkeleton from '@/components/ui/loader/LoaderSkeleton'
import { ICounterpartyResponse } from '@/types/counterparty'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import dynamic from 'next/dynamic'
import styles from './CounterpartiesPage.module.scss'
import { httpClient1CServer } from '@/lib/http-client/httpServer'

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
const CounterpartiesWrapper = dynamic(
  () =>
    import('../../../components/counterparties/CounterpartiesWrapper').then(
      (mod) => ({
        default: mod.CounterpartiesWrapper,
      })
    ),
  {
    ssr: true,
    loading: () => <LoaderSkeleton />,
  }
)

interface CounterpartiesPageProps {
  searchParams: Promise<{
    limit?: string
    page?: string
    search?: string
  }>
}

export async function generateMetadata(
  props: CounterpartiesPageProps
): Promise<Metadata> {
  return {
    title: 'Контрагенты | Личный кабинет',
    description: 'Список контрагентов',
  }
}

export default async function CounterpartiesPage(
  props: CounterpartiesPageProps
) {
  const searchParams = await props.searchParams
  const limit = Number(searchParams.limit) || 150
  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ''

  try {
    const cookieStore = await cookies()

    const queryString = new URLSearchParams({
      limit: String(limit),
      page: String(page),
      ...(search && { search }),
    }).toString()

    const data = await httpClient1CServer.get<ICounterpartyResponse>(
      cookieStore,
      `api/counterparties/?${queryString}`
    )
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Контрагенты</h1>
        <Toolbar totalItems={data.count} currentLimit={limit} />
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <CounterpartiesWrapper
              counterpartiesData={data.results}
              limit={limit}
              page={page}
              count={data.count}
            />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching counterparties:', error)
    throw error
  }
}
