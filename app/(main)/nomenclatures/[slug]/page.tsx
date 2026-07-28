// app/(main)/nomenclatures/[slug]/page.tsx
import {
  MapPlacement,
  ResponsibleCard,
  TabsWrapper,
  Description,
} from '@/components/nomenclatureById'
import { Radio } from 'lucide-react'
import { INomenclatureItem, ITenantsResponse } from '@/types/nomenclature'
import Image from 'next/image'

import {
  generateNomenclatureMetadata,
  generateNomenclatureStructuredData,
  generateNotFoundMetadata,
} from '@/lib/configs/config-meta/nomenclatures'
import Script from 'next/script'
import { formatPrice } from '@/utils/nomenclatureUtils'
import { EcommerceTracker } from '@/components/ecommerce/EcommerceTracker'
import { AddButtonToOrder } from '@/components/ui/button/AddButtonToOrder'
import BreadcrumbsSetter from '@/components/ui/breadcrumbs/BreadcrumbsSetter'
import ModalFeedBack from '@/components/nomenclatureById/modalFeedBack/ModalFeedBack'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import Slider from '@/components/slider/Slider'
import { PlaceTitle } from '@/components/nomenclatureById/PlaceTitle'

import { QuickStats } from '@/components/nomenclatureById/detail/QuickStats'
import { PricingTable } from '@/components/nomenclatureById/detail/PricingTable'
import { WhyThisPlace } from '@/components/nomenclatureById/detail/WhyThisPlace'
import { SuitableBusinesses } from '@/components/nomenclatureById/detail/SuitableBusinesses'
import { HowToStartSection } from '@/components/nomenclatureById/detail/HowToStartSection'
import { CTABriefSection } from '@/components/nomenclatureById/detail/CTABriefSection'
import { SimilarPlacements } from '@/components/nomenclatureById/detail/SimilarPlacements'
import { NomenclatureSEOText } from '@/components/nomenclatureById/detail/NomenclatureSEOText'
import { NomenclatureFAQ } from '@/components/nomenclatureById/detail/NomenclatureFAQ'

interface NomenclatureDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

const getNomenclatureById = cache(async (slug: string) => {
  try {
    const response = await fetch(
      `${process.env.API_1C_URL}api/nomenclatures/web/${slug}`,
      {
        cache: 'no-store',
      }
    )

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch (e) {
    return null
  }
})

async function getTenantsByNomenclatureId(
  id: string
): Promise<ITenantsResponse | null> {
  try {
    const url = new URL(
      `api/nomenclatures/${id}/tenant/?limit=25&offset=0`,
      process.env.API_1C_URL
    )

    const response = await fetch(url.toString(), {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) return null
    return response.json()
  } catch (error) {
    return null
  }
}

async function getSimilarNomenclatures(
  typeOfPlaceName: string | undefined,
  excludeId: string
): Promise<INomenclatureItem[]> {
  if (!typeOfPlaceName) return []

  try {
    const url = new URL('api/nomenclatures/', process.env.API_1C_URL)
    url.searchParams.set('type_of_place', typeOfPlaceName)
    url.searchParams.set('limit', '4')

    const response = await fetch(url.toString(), { cache: 'no-store' })
    if (!response.ok) return []

    const data = await response.json()
    const results: INomenclatureItem[] = Array.isArray(data?.results)
      ? data.results
      : []

    return results.filter((item) => item.id !== excludeId)
  } catch {
    return []
  }
}

export async function generateMetadata(props: any) {
  const params = await props.params
  const { slug } = params

  const nomenclature = await getNomenclatureById(slug)

  if (!nomenclature) {
    return generateNotFoundMetadata()
  }

  const metadata = generateNomenclatureMetadata({ nomenclature, id: slug })

  return {
    ...metadata,
    alternates: {
      canonical: `${SITE_URL}/nomenclatures/${nomenclature.slug}`,
    },
  }
}

export default async function NomenclatureDetailPage(
  props: NomenclatureDetailPageProps
) {
  const params = await props.params
  const { slug } = params
  const nomenclature = await getNomenclatureById(slug)

  if (!nomenclature) {
    notFound()
  }

  const {
    brand,
    exterior,
    interior,
    pricePerMonth,
    contentType,
    address,
    responsible,
    nameForFront,
    description,
  } = nomenclature

  const allImages = [...exterior, ...interior]

  const structuredData = generateNomenclatureStructuredData(nomenclature, slug)
  const breadcrumbItems = [
    { name: 'Главная', url: `${SITE_URL}` },
    { name: 'Места для рекламы', url: `${SITE_URL}/nomenclatures` },
    { name: nameForFront, url: `${SITE_URL}/nomenclatures/${slug}` },
  ]

  const tenantsData = await getTenantsByNomenclatureId(nomenclature.id)
  const similarPlaces = await getSimilarNomenclatures(
    nomenclature.typeOfPlace?.name,
    nomenclature.id
  )

  const nomenclaturesIds = [slug]
  const formattedAddress: string | undefined =
    nomenclature.formattedAddress?.name

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <EcommerceTracker
        item={{
          item_id: slug,
          item_name: nameForFront,
          item_category: contentType,
          item_brand: brand?.name,
          price: pricePerMonth,
        }}
      />
      <BreadcrumbsSetter
        title={`${nomenclature.typeOfPlace?.abbreviation || ''} ${brand ? brand.name : ''}`}
      />

      <Script
        id={`structured-data-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
        strategy="afterInteractive"
      />

      <div className="bg-slate-50 text-slate-900 overflow-auto">
        {/* Hero / main placement */}
        <section className="bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Gallery + characteristics */}
            <div>
              <div>
                {/* <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] min-h-[240px]"> */}
                {allImages.length > 0 ? (
                  <Slider
                    images={allImages}
                    autoPlay
                    autoPlayTime={15000}
                    // width="50%"
                    // height="70%"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 p-4">
                    {brand && (
                      <Image
                        src={brand.logotype || '/og-logo.jpg'}
                        alt="Логотип"
                        width={200}
                        height={100}
                        className="max-h-full w-auto object-contain"
                        loading="lazy"
                      />
                    )}
                  </div>
                )}
                {/* </div> */}
              </div>

              <div className="mt-5 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="border-b px-6 py-4">
                  <h2 className="text-xl font-black text-slate-900">
                    Характеристики площадки
                  </h2>
                </div>
                <div className="p-4">
                  <Description nomenclature={nomenclature} />
                </div>
              </div>
            </div>

            {/* Main info */}
            <div className="space-y-5">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                {brand?.name && (
                  <div className="mb-3 inline-flex rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-500">
                    {brand.name}
                  </div>
                )}

                <PlaceTitle place={nomenclature} variant="full" />

                {description && (
                  <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-8 text-slate-600">
                    {description}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  {contentType && (
                    <span className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-black text-blue-700">
                      {contentType}
                    </span>
                  )}
                  {pricePerMonth && (
                    <span className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                      Стоимость: от {formatPrice(pricePerMonth)}/день
                    </span>
                  )}
                  <span className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
                    При размещении от 1 месяца
                  </span>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <AddButtonToOrder item={nomenclature} />
                  <ModalFeedBack
                    pathName="nomenclatures"
                    nomenclaturesIds={nomenclaturesIds}
                  />
                </div>
              </div>
              <QuickStats
                possibility={nomenclature.possibility}
                contentType={contentType}
              />

              {/* <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-2xl font-black text-slate-900">
                  Стоимость размещения
                </h2>
                <PricingTable pricePerDay={pricePerMonth} />
              </div> */}
              {responsible?.ad && (
                <div className="rounded-3xl bg-violet-50 p-6 ring-1 ring-violet-100">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">
                        Ответственный за размещение
                      </h2>
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <ResponsibleCard
                          label="за размещения"
                          icon={<Radio size={16} />}
                          phoneNumber={responsible?.ad?.phone_number}
                          name={responsible?.ad?.full_name || 'Не указан'}
                          color=""
                        />
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        Поможет уточнить условия, сроки запуска и подготовить
                        медиаплан.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <WhyThisPlace placeName={nameForFront} />
        <SuitableBusinesses />

        {/* Map + tenants */}
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.95fr_1.05fr]">
            {/* <div>
              <div className="mb-5">
                <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                  На карте
                </div>
                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  Адрес размещения
                </h2>
                {formattedAddress && (
                  <p className="mt-3 text-slate-600">{formattedAddress}</p>
                )}
              </div>

              <div className="relative h-[430px] overflow-hidden rounded-3xl bg-slate-200 shadow-sm ring-1 ring-slate-200">
                <MapPlacement
                  lat={
                    address?.coordinates?.latitude
                      ? Number(address.coordinates.latitude)
                      : 56.011152
                  }
                  lng={
                    address?.coordinates?.longitude
                      ? Number(address.coordinates.longitude)
                      : 92.814753
                  }
                  className="h-full"
                />
              </div>
            </div> */}

            <div className="mb-5">
              <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                Арендаторы
              </div>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Кто представлен в ТЦ
              </h2>
              <p className="mt-3 text-slate-600">
                Блок арендаторов усиливает доверие к площадке и помогает понять
                тип аудитории.
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
              <TabsWrapper
                item={nomenclature}
                initialTenantsData={tenantsData}
              />
            </div>
          </div>
        </section>

        <HowToStartSection />

        <CTABriefSection
          placeName={nameForFront}
          nomenclaturesIds={nomenclaturesIds}
        />

        <SimilarPlacements places={similarPlaces} />

        <NomenclatureSEOText
          placeName={nameForFront}
          address={formattedAddress}
          contentType={contentType}
        />

        <NomenclatureFAQ
          placeName={nameForFront}
          pricePerDay={pricePerMonth}
          contentType={contentType}
        />
      </div>
    </>
  )
}
