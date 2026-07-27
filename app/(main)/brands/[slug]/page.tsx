import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { httpClient1CServer } from '@/lib/http-client/httpServer'
import { IBrandDetail } from '@/types/brands'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { EcommerceTracker } from '@/components/ecommerce/EcommerceTracker'
import BreadcrumbsSetter from '@/components/ui/breadcrumbs/BreadcrumbsSetter'

import { Hero } from '@/components/brands/detail/Hero'
import { BrandIntro } from '@/components/brands/detail/BrandIntro'
import { WhyThisBrand } from '@/components/brands/detail/WhyThisBrand'
import { BrandPlacesSection } from '@/components/brands/detail/BrandPlacesSection'
import { BrandAudience } from '@/components/brands/detail/BrandAudience'
import { HowToStartBrand } from '@/components/brands/detail/HowToStartBrand'
import { CTABriefBrand } from '@/components/brands/detail/CTABriefBrand'
import { SimilarBrands } from '@/components/brands/detail/SimilarBrands'
import { BrandSEOText } from '@/components/brands/detail/BrandSEOText'
import { BrandFAQ } from '@/components/brands/detail/BrandFAQ'

interface BrandDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getBrandBySlug(slug: string): Promise<IBrandDetail | null> {
  try {
    const cookieStore = await cookies()

    const data = await httpClient1CServer.get<IBrandDetail>(
      cookieStore,
      `api/brands/${slug}/`
    )

    return data
  } catch (error) {
    console.error('Error fetching brand:', {
      error: error instanceof Error ? error.message : error,
      slug,
      apiUrl: process.env.API_1C_URL,
    })

    if (error instanceof Error && error.message.includes('404')) {
      return null
    }

    throw error
  }
}

async function getBrandPlacesCount(brandId: string): Promise<number> {
  try {
    const url = new URL(
      `api/brands/${brandId}/nomenclatures`,
      process.env.API_1C_URL
    )
    url.searchParams.set('limit', '1')

    const res = await fetch(url.toString(), { cache: 'no-store' })
    if (!res.ok) return 0

    const data = await res.json()
    return data?.count ?? 0
  } catch {
    return 0
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
      title: `Размещение звуковой и видео рекламы внутри помещений ${brand.name} | «RMC»`,
      description: `Размещение Indoor рекламы в ${brand.name}. По цене от ${Number(brand.min_price)}р. Звуковая и видео реклама внутри помещений. Звоните: ☎ 8 800 222 59 38`,
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

export default async function BrandDetailPage(props: BrandDetailPageProps) {
  const params = await props.params
  const { slug } = params

  const brand = await getBrandBySlug(slug)

  if (!brand) {
    notFound()
  }

  const placesCount = await getBrandPlacesCount(brand.id)

  const fullName = brand.name
  const breadcrumbItems = [
    { name: 'Главная', url: `${SITE_URL}` },
    { name: 'Бренды', url: `${SITE_URL}/brands` },
    { name: fullName, url: `${SITE_URL}/brands/${slug}` },
  ]

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

      <div className="bg-slate-50 text-slate-900 overflow-auto">
        <Hero brand={brand} placesCount={placesCount} />
        <BrandIntro brandName={fullName} description={brand.description} />
        <WhyThisBrand brandName={fullName} />
        <BrandPlacesSection brandId={brand.id} brandName={fullName} />
        <BrandAudience brandName={fullName} />
        <HowToStartBrand brandName={fullName} />
        <CTABriefBrand brandName={fullName} brandId={brand.id} />
        <SimilarBrands excludeSlug={slug} />
        <BrandSEOText brandName={fullName} />
        <BrandFAQ brandName={fullName} minPrice={brand.min_price} />
      </div>
    </>
  )
}
