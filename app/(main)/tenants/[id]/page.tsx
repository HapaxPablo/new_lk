import { BackButton } from '@/components/ui/button/BackButton'
import BreadcrumbsSetter from '@/components/ui/breadcrumbs/BreadcrumbsSetter'
import { InfoRow } from '@/components/ui/InfoRow'
import { httpClient1CServer } from '@/lib/http-client/httpServer'
import { ITenantDetailResponse } from '@/types/tenants'
import { Building2, Hash, KeyRound, Layers, MapPinned } from 'lucide-react'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from './TenantDetail.module.scss'
import { CardNomenclature } from '@/components/ui/card/CardNomenclature'
import { PlacesGrid } from './PlacesGrid'
import Image from 'next/image'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
import { EcommerceTracker } from '@/components/ecommerce/EcommerceTracker'
import { INomenclatureItem } from '@/types/nomenclature'

interface TenantDetailPageProps {
  params: Promise<{
    id: string
  }>
}

async function getTenantById(
  id: string
): Promise<ITenantDetailResponse | null> {
  try {
    const cookieStore = await cookies()

    return await httpClient1CServer.get<ITenantDetailResponse>(
      cookieStore,
      `api/tenants/${id}/`
    )
  } catch (error) {
    console.error('Error fetching tenant:', {
      error: error instanceof Error ? error.message : error,
      id,
      apiUrl: process.env.API_1C_URL,
    })

    if (error instanceof Error && error.message.includes('404')) {
      return null
    }

    throw error
  }
}

async function getNomenclatures(ids: string[]): Promise<INomenclatureItem[]> {
  if (!ids.length) return []
  // console.log('Fetching nomenclatures for IDs:', ids)
  const baseUrl = new URL('api/nomenclatures/bulk/', process.env.API_1C_URL)
  baseUrl.searchParams.set('ids', ids.join(','))

  try {
    const res = await fetch(baseUrl.toString(), { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    // console.log('Fetched nomenclatures:', data)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function generateMetadata(
  props: TenantDetailPageProps
): Promise<Metadata> {
  try {
    const { id } = await props.params
    const tenant = await getTenantById(id)

    if (!tenant) {
      return {
        title: 'Арендатор не найден | Личный кабинет',
      }
    }

    return {
      title: `${tenant.tenantName || tenant.keyword || 'Арендатор'} | Арендаторы`,
      description: `Расшифровка арендатора ${tenant.tenantName || tenant.keyword}`,
    }
  } catch (error) {
    console.error('Error generating tenant metadata:', error)
    return {
      title: 'Ошибка | Арендаторы',
    }
  }
}

export default async function TenantDetailPage(props: TenantDetailPageProps) {
  const { id } = await props.params
  const tenant = await getTenantById(id)

  if (!tenant) {
    notFound()
  }

  const nomenclatureIds = tenant.places.map((p) => p.nomenclatureId)
  const nomenclatures = await getNomenclatures(nomenclatureIds)

  const title = tenant.brand.name || 'Арендатор'
  const breadcrumbItems = [
    { name: 'Главная', url: `${SITE_URL}` },
    { name: 'Арендаторы', url: `${SITE_URL}/tenants` },
    { name: tenant.brand.name, url: `${SITE_URL}/tenants/${tenant.brand.name}` },
  ]
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <EcommerceTracker
        item={{
          item_id: tenant.tenantId,
          item_name: tenant.brand.name,
          item_category: tenant.brand.name,
          item_tenant: tenant.brand.name,
          price: '0',
        }}
      />
      <BreadcrumbsSetter title={title} />

      <div className={styles.container}>
        {/* <BackButton to="/tenants" /> */}

        <section className={styles.summaryCard}>
          <div className={styles.header}>
            <div className={styles.logotype}>
              {tenant.brand?.logotype ? (
                <Image
                  src={tenant.brand.logotype}
                  alt={`Бренд ${tenant.brand.name || 'Бренд'}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className={styles.image}
                  priority
                />
              ) : (
                <div className={styles.logoPlaceholder}>
                  <Image
                    src="/og-logo.jpg"
                    alt="Логотип"
                    width={200}
                    height={100}
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
            <h1 className={styles.title}>{title}</h1>
            <span className={styles.placesBadge}>
              <MapPinned size={16} />
              {tenant.totalPlaces} мест
            </span>
          </div>


        </section>

        <div className={styles.placesHeader}>
          <h2 className={styles.sectionTitle}>Места размещения</h2>
        </div>

        {tenant.places.length > 0 ? (
          <div className={styles.placeGrid}>
            <PlacesGrid places={tenant.places} nomenclatures={nomenclatures} />
          </div>
        ) : (
          <p className={styles.emptyText}>Места размещения не найдены</p>
        )}
      </div>
    </>
  )
}
