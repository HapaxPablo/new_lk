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

import { NextRequest } from 'next/server'
import { httpClient1CServer } from '@/lib/http-client/httpServer'

export default async function CounterpartiesPage(props: CounterpartiesPageProps) {
  const searchParams = await props.searchParams
  const limit = Number(searchParams.limit) || 150
  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ''

  try {
    const cookieStore = await cookies()
    
    // Создаем моковый NextRequest с кукам
    const url = new URL('http://localhost')
    const headers = new Headers()
    headers.set('cookie', cookieStore.toString())
    
    const accessToken = cookieStore.get('access_token')?.value
    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`)
    }
    
    const mockRequest = new NextRequest(url, {
      headers,
    })

    // Прямой запрос к 1C API через HttpClient
    const queryString = new URLSearchParams({
      limit: String(limit),
      page: String(page),
      ...(search && { search }),
    }).toString()

    const data = await httpClient1CServer.get<ICounterpartyResponse>(
      mockRequest,
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