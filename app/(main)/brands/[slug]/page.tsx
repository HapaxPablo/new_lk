import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import styles from './BrandDetail.module.scss'
import { InfoRow } from '@/components/ui/InfoRow'
import {
    FileText,
} from 'lucide-react'
import { httpClient1CServer } from '@/lib/http-client/httpServer'
import { IBrandDetail } from '@/types/brands'
import Image from 'next/image'
import { BrandNomenclatures } from '@/components/brands/nomenclatures/BrandNomenclaturesWrapper'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { EcommerceTracker } from '@/components/ecommerce/EcommerceTracker'
import BreadcrumbsSetter from '@/components/ui/breadcrumbs/BreadcrumbsSetter'
import { Button } from '@/components/ui/button/Button'
import ModalFeedBack from '@/components/nomenclatureById/modalFeedBack/ModalFeedBack'

interface BrandDetailPageProps {
    params: Promise<{
        slug: string
    }>
}

async function getBrandBySlug(slug: string): Promise<IBrandDetail | null> {
    try {
        const cookieStore = await cookies()

        console.log('Fetching brand details for slug:', slug)

        // Правильный эндпоинт с ID в пути
        const data = await httpClient1CServer.get<IBrandDetail>(
            cookieStore,
            `api/brands/${slug}/`
        )

        // console.log('Brand data received:', data)
        return data

    } catch (error) {
        console.error('Error fetching brand:', {
            error: error instanceof Error ? error.message : error,
            slug,
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
    props: BrandDetailPageProps
): Promise<Metadata> {
    try {
        const params = await props.params
        const { slug } = params

        const brand = await getBrandBySlug(slug)

        if (!brand) {
            return {
                title: 'Бренд не найден | Личный кабинет',
            }
        }

        const canonicalUrl = `${SITE_URL}/brands/${slug}`

        return {
            title: `${brand.name || 'Бренд'} | Бренды`,
            description: brand.description || `Информация о бренде ${brand.name}`,
            alternates: {
                canonical: canonicalUrl,
            },
        }
    } catch (error) {
        console.error('Error generating metadata:', error)
        return {
            title: 'Ошибка | Бренды',
        }
    }
}
export default async function BrandDetailPage(
    props: BrandDetailPageProps
) {
    const params = await props.params
    const { slug } = params

    const brand = await getBrandBySlug(slug)
    console.log('DETAILS', brand)

    if (!brand) {
        notFound() // Используем Next.js notFound для 404 страницы
    }

    const fullName = brand.name
    const breadcrumbItems = [
        { name: 'Главная', url: `${SITE_URL}` },
        { name: 'Бренды', url: `${SITE_URL}/brands` },
        { name: fullName, url: `${SITE_URL}/brands/${slug}` },
    ]

    const brandId = brand.id
    return (
        <>
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <EcommerceTracker
                item={{
                    item_id: slug,
                    item_name: fullName,
                    item_category: fullName,
                    item_brand: brand?.name,
                    price: '0',
                }}
            />
            <BreadcrumbsSetter title={`${brand.name || 'Бренд'}`} />

            <div className={styles.container}>
                <div className={styles.card}>

                    <div className={styles.header}>
                        <div className={styles.logotype}>
                            {brand.logotype ? (
                                <Image
                                    src={brand.logotype}
                                    alt={`Бренд ${brand.name || 'Бренд'}`}
                                    fill
                                    className={styles.image}
                                />
                            ) : (
                                <div className={styles.logoPlaceholder}>
                                    <Image
                                        src="/og-logo.jpg"
                                        alt="Логотип"
                                        width={200}
                                        height={100}
                                        className="object-contain"
                                    />
                                </div>
                            )}
                        </div>
                        <h1 className={styles.title}>
                            {fullName || 'Бренд'}
                        </h1>
                        <ModalFeedBack pathName='brands' brandId={brandId} />
                    </div>

                </div>



                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Описание</h2>
                    <InfoRow
                        icon={<FileText size={16} />}
                        label=""
                        value={brand.description || '-'}
                    />
                </div>
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Номенклатуры</h2>
                    <BrandNomenclatures brandId={brand.id} />
                </div>
            </div>
        </>
    )
}