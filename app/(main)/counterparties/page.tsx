import LoaderSkeleton from '@/components/ui/loader/LoaderSkeleton'
import { ICounterpartyResponse } from '@/types/counterparty'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import dynamic from 'next/dynamic'
import styles from './CounterpartiesPage.module.scss'

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
  const params = await searchParams
  const limit = Number(params.limit) || 150
  const page = Number(params.page) || 1
  const search = params.search || ''

  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    const url = new URL('/api/counterparties', baseUrl)
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('page', String(page))
    if (search) url.searchParams.set('search', search)

    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const response = await fetch(url.toString(), {
      headers: {
        Cookie: cookieHeader,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`)
    }

    const data: ICounterpartyResponse = await response.json()
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
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error('Произошла неизвестная ошибка')
    }
  }
}
