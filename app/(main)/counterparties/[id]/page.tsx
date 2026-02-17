import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { ICounterpartyDetails } from '@/types/counterparty'
import styles from './CounterpartyDetail.module.scss'
import { InfoRow } from '@/components/ui/InfoRow'
import {
  Building,
  Hash,
  Calendar,
  User,
  FileText,
} from 'lucide-react'
import { httpClient1CServer } from '@/lib/http-client/httpServer'

interface CounterpartyDetailPageProps {
  params: Promise<{
    id: string
  }>
}

async function getCounterpartyById(id: string): Promise<ICounterpartyDetails | null> {
  try {
    const cookieStore = await cookies()

    console.log('Fetching counterparty details for ID:', id)

    // Правильный эндпоинт с ID в пути
    const data = await httpClient1CServer.get<ICounterpartyDetails>(
      cookieStore,
      `api/counterparties/${id}/`  
    )

    // console.log('Counterparty data received:', data)
    return data
    
  } catch (error) {
    console.error('Error fetching counterparty:', {
      error: error instanceof Error ? error.message : error,
      id,
      apiUrl: process.env.API_1C_URL,
    })
    
    // Если ошибка 404, возвращаем null для отображения 404 страницы
    if (error instanceof Error && error.message.includes('404')) {
      return null
    }
    
    // Пробрасываем ошибку дальше для обработки error.tsx
    throw error
  }
}

export async function generateMetadata(
  props: CounterpartyDetailPageProps
): Promise<Metadata> {
  try {
    const params = await props.params
    const { id } = params

    const counterparty = await getCounterpartyById(id)

    if (!counterparty) {
      return {
        title: 'Контрагент не найден | Личный кабинет',
      }
    }

    const fullName = [
      counterparty.last_name,
      counterparty.first_name,
      counterparty.middle_name,
    ]
      .filter(Boolean)
      .join(' ')

    return {
      title: `${fullName || counterparty.additional_name || 'Контрагент'} | Контрагенты`,
      description: counterparty.description || `Информация о контрагенте ${fullName}`,
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Ошибка | Контрагенты',
    }
  }
}

export default async function CounterpartyDetailPage(
  props: CounterpartyDetailPageProps
) {
  const params = await props.params
  const { id } = params

  const counterparty = await getCounterpartyById(id)
  console.log('DETAILS', counterparty)

  if (!counterparty) {
    notFound() // Используем Next.js notFound для 404 страницы
  }

  const formattedDate = counterparty.created
    ? new Date(counterparty.created).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

  const fullName = [
    counterparty.last_name,
    counterparty.first_name,
    counterparty.middle_name,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {fullName || counterparty.additional_name || 'Контрагент'}
          </h1>
          <span
            className={`${styles.statusBadge} ${
              counterparty.is_active ? styles.active : styles.inactive
            }`}
          >
            {counterparty.is_active ? 'Активен' : 'Неактивен'}
          </span>
        </div>

        <InfoRow
          icon={<Building size={16} />}
          label="ОПФ"
          value={counterparty.opf || '-'}
        />
        <InfoRow
          icon={<Hash size={16} />}
          label="ИНН"
          value={counterparty.inn || '-'}
        />
        <InfoRow
          icon={<Hash size={16} />}
          label="Код 1С"
          value={counterparty.code1c || '-'}
          valueClassName={styles.smallText}
        />
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Описание</h2>
        <InfoRow
          icon={<FileText size={16} />}
          label=""
          value={counterparty.description || '-'}
        />
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Дополнительная информация</h2>
        <div className={styles.grid}>
          <InfoRow
            icon={<User size={16} />}
            label="Ключевое слово"
            value={counterparty.keyword || '-'}
          />
          <InfoRow
            icon={<User size={16} />}
            label="Дополнительное наименование"
            value={counterparty.additional_name || '-'}
          />
          <InfoRow
            icon={<Calendar size={16} />}
            label="Дата создания"
            value={formattedDate}
          />
          <InfoRow
            icon={<User size={16} />}
            label="Рассылка"
            value={counterparty.broadcast ? 'Включена' : 'Отключена'}
          />
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Контактные лица</h2>
        <div className={styles.list}>
          {counterparty.contact_persons?.length > 0 ? (
            counterparty.contact_persons.map((person, index) => (
              <div key={index} className={styles.listItem}>
                {person}
              </div>
            ))
          ) : (
            <p className={styles.listItem}>-</p>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Бренды</h2>
        <div className={styles.list}>
          {counterparty.brands?.length > 0 ? (
            counterparty.brands.map((brand, index) => (
              <div key={index} className={styles.listItem}>
                {brand}
              </div>
            ))
          ) : (
            <p className={styles.listItem}>-</p>
          )}
        </div>
      </div>
    </div>
  )
}