// app/promotions/page.tsx
import LoaderSkeleton from '@/components/ui/loader/LoaderSkeleton'
import { IPromotionResponse } from '@/types/promotion'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'
import styles from './PromotionsPage.module.scss'
import { httpClient1CServer } from '@/lib/http-client/httpServer'

const Toolbar = dynamic(
  () =>
    import('../../../components/toolbar/Toolbar').then((mod) => ({
      default: mod.default,
    })),
  { ssr: true, loading: () => <LoaderSkeleton /> }
)

const PromotionsWrapper = dynamic(
  () =>
    import('../../../components/promotions/PromotionsWrapper').then((mod) => ({
      default: mod.PromotionsWrapper,
    })),
  { ssr: true, loading: () => <LoaderSkeleton /> }
)

interface PromotionsPageProps {
  searchParams: Promise<{
    limit?: string
    page?: string
    search?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Акции | Личный кабинет',
    description: 'Список акций',
  }
}

export default async function PromotionsPage(props: PromotionsPageProps) {
  const searchParams = await props.searchParams
  const limit = Number(searchParams.limit) || 150
  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ''

  try {
    const cookieStore = await cookies()

    // Проверяем наличие токена
    const accessToken = cookieStore.get('access_token')?.value
    if (!accessToken) {
      redirect('/login')
    }

    const queryString = new URLSearchParams({
      limit: String(limit),
      page: String(page),
      ...(search && { search }),
    }).toString()

    // Прямой вызов httpClient1CServer с cookieStore
    const data = await httpClient1CServer.get<IPromotionResponse>(
      cookieStore,
      `api/promotions/?${queryString}`
    )

    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Акции</h1>
        <Toolbar totalItems={data.count} currentLimit={limit} />
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <PromotionsWrapper
              promotionsData={data.results}
              limit={limit}
              page={page}
              count={data.count}
            />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching promotions:', error)

    if (error instanceof Error && error.message === 'Session expired') {
      redirect('/login')
    }

    throw error
  }
}
