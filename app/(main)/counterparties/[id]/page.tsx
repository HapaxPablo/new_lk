import { Metadata } from 'next'
import { cookies } from 'next/headers'
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

interface CounterpartyDetailPageProps {
  params: Promise<{
    id: string
  }>
}

async function getCounterpartyById(
  id: string
): Promise<ICounterpartyDetails | null> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      console.error('No access token found')
      return null
    }

    // Прямой запрос к 1C API
    const apiUrl = `${process.env.API_1C_URL}api/counterparties/${id}`
    
    console.log('Direct request to 1C API:', apiUrl)
    console.log('Token present:', !!accessToken)
    console.log('Token (first 20 chars):', accessToken.substring(0, 20))

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `access_token ${accessToken}`, 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    })

    console.log('1C API Response status:', response.status)

    if (!response.ok) {
      console.error(`1C API responded with status: ${response.status}`)
      
      const errorText = await response.text()
      console.error('Error response:', errorText)
      
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Successfully fetched counterparty:', data.id)
    return data
  } catch (error) {
    console.error('Error fetching counterparty:', {
      error: error instanceof Error ? error.message : error,
      id,
      apiUrl: process.env.API_1C_URL,
    })
    return null
  }
}

// Генерация метаданных для SEO
export async function generateMetadata(
  props: CounterpartyDetailPageProps
): Promise<Metadata> {
  const params = await props.params
  const { id } = params

  const counterparty = await getCounterpartyById(id)

  if (!counterparty) {
    return {
      title: 'Контрагент не найден | Личный кабинет',
    }
  }

  return {
    title: `${counterparty.first_name} ${counterparty.last_name} | Контрагенты`,
    description:
      counterparty.description ||
      `Информация о контрагенте ${counterparty.first_name} ${counterparty.last_name}`,
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
    return (
      <div className={styles.container}>
        <div className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>Контрагент не найден</h1>
          <p>Запрошенный контрагент с ID {id} не существует или был удален.</p>
        </div>
      </div>
    )
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

  // Формирование полного имени
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
          value={counterparty.opf ? counterparty.opf : '-'}
        />
        <InfoRow
          icon={<Hash size={16} />}
          label="ИНН"
          value={counterparty.inn ? counterparty.inn : '-'}
        />
        <InfoRow
          icon={<Hash size={16} />}
          label="Код 1С"
          value={counterparty.code1c ? counterparty.code1c : '-'}
          valueClassName={styles.smallText}
        />
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Описание</h2>
        <InfoRow
          icon={<FileText size={16} />}
          label=""
          value={counterparty.description ? counterparty.description : '-'}
        />
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Дополнительная информация</h2>
        <div className={styles.grid}>
          <InfoRow
            icon={<User size={16} />}
            label="Ключевое слово"
            value={counterparty.keyword ? counterparty.keyword : '-'}
          />
          <InfoRow
            icon={<User size={16} />}
            label="Дополнительное наименование"
            value={
              counterparty.additional_name ? counterparty.additional_name : '-'
            }
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
          {counterparty.contact_persons &&
          counterparty.contact_persons.length > 0 ? (
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
          {counterparty.brands && counterparty.brands.length > 0 ? (
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