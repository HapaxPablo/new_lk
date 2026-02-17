import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { IPromotionDetails } from '@/types/promotion'
import styles from './PromotionDetail.module.scss'
import { InfoRow } from '@/components/ui/InfoRow'
import { Tag, Hash, Calendar, Users, Image } from 'lucide-react'
import { httpClient1CServer } from '@/lib/http-client/httpServer'
import { notFound } from 'next/navigation'

interface PromotionDetailPageProps {
  params: Promise<{
    id: string
  }>
}

async function getPromotionById(id: string): Promise<IPromotionDetails | null> {
  try {
    const cookieStore = await cookies()

    // Получаем токен из cookies
    const token = cookieStore.get('access_token')?.value
    const xrmcCookie = cookieStore.get('xrmcCookie')?.value

    if (!token) {
      console.error('No access token found')
      return null
    }

    // Используем прямой метод с токеном
    const data = await httpClient1CServer.get<IPromotionDetails>(
      cookieStore,
      `api/promotions/${id}/`
    )

    return data
  } catch (error) {
    console.error('Error fetching promotion:', {
      error,
      id,
      environment: process.env.NODE_ENV,
      apiUrl: process.env.API_1C_URL,
    })

    // Если ошибка 404, возвращаем null
    if (error instanceof Error && error.message.includes('404')) {
      return null
    }

    return null
  }
}

export async function generateMetadata(
  props: PromotionDetailPageProps
): Promise<Metadata> {
  try {
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
  } catch (error) {
    return {
      title: 'Ошибка | Акции',
    }
  }
}

export default async function PromotionDetailPage(
  props: PromotionDetailPageProps
) {
  const params = await props.params
  const { id } = params

  const promotion = await getPromotionById(id)

  if (!promotion) {
    notFound() // Используем next/navigation для 404
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
