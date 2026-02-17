import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { IPromotionDetails } from '@/types/promotion'
import styles from './PromotionDetail.module.scss'
import { InfoRow } from '@/components/ui/InfoRow'
import { Tag, Hash, Calendar, Users, Image } from 'lucide-react'

interface PromotionDetailPageProps {
  params: Promise<{
    id: string
  }>
}

async function getPromotionById(id: string): Promise<IPromotionDetails | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL
      ? `${process.env.NEXT_PUBLIC_URL}`
      : `https://${process.env.API_1C_URL?.replace(/^https?:\/\//, '').split('/')[0] || 'localhost:3000'}`
    const url = new URL(`/api/promotions/${id}`, baseUrl)

    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    // Get the access token from cookies to forward via header
    const accessToken = cookieStore.get('access_token')?.value

    // Build headers - include both Cookie and x-access-token
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    if (cookieHeader) {
      headers['Cookie'] = cookieHeader
    }

    if (accessToken) {
      headers['x-access-token'] = accessToken
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      cache: 'no-store',
      headers,
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`)
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching promotion:', {
      message: error,
      id: id,
      environment: process.env.NODE_ENV,
      apiUrl: process.env.API_1C_URL,
    })
    return null
  }
}

export async function generateMetadata(
  props: PromotionDetailPageProps
): Promise<Metadata> {
  const params = await props.params
  const { id } = params

  const promotion = await getPromotionById(id)

  if (!promotion) {
    return {
      title: 'Акция не найдена | Личный кабинет',
    }
  }

  return {
    title: `${promotion.main_info || 'Акция'} | Акции`,
    description: `Детальная информация об акции`,
  }
}

export default async function PromotionDetailPage(
  props: PromotionDetailPageProps
) {
  const params = await props.params
  const { id } = params

  const promotion = await getPromotionById(id)

  if (!promotion) {
    return (
      <div className={styles.container}>
        <div className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>Акция не найдена</h1>
          <p>Запрошенная акция с ID {id} не существует или была удалена.</p>
        </div>
      </div>
    )
  }

  const formattedDate = promotion.created
    ? new Date(promotion.created).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Акция</h1>
        </div>

        {promotion.logotype && (
          <div className={styles.logotypeContainer}>
            <Image size={24} />
            <span className={styles.logotypeLabel}>Логотип</span>
            <img
              src={promotion.logotype}
              alt="Логотип акции"
              className={styles.logotype}
            />
          </div>
        )}

        <InfoRow
          icon={<Tag size={16} />}
          label="Название"
          value={promotion.main_info || '-'}
        />
        <InfoRow
          icon={<Hash size={16} />}
          label="Код 1С"
          value={promotion.code1c ? promotion.code1c : '-'}
          valueClassName={styles.smallText}
        />
        <InfoRow
          icon={<Calendar size={16} />}
          label="Дата создания"
          value={formattedDate}
        />
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Временная шкала</h2>
        <InfoRow
          icon={<Calendar size={16} />}
          label=""
          value={promotion.timeline || '-'}
        />
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Контрагент</h2>
        <InfoRow
          icon={<Users size={16} />}
          label=""
          value={promotion.counterparty || '-'}
        />
      </div>
    </div>
  )
}
