// app/(main)/nomenclatures/[slug]/page.tsx
import {
  ResponsibleCard,
  TabsWrapper,
  Description,
} from '@/components/nomenclatureById'
import { Radio } from 'lucide-react'
import {
  IAddress,
  INomenclatureDetailsItem,
  INomenclatureItem,
  ITenantsResponse,
  IWebNomenclatureDetailsItem,
} from '@/types/nomenclature'
import Image from 'next/image'

import {
  generateNomenclatureMetadata,
  generateNomenclatureStructuredData,
  generateNotFoundMetadata,
} from '@/lib/configs/config-meta/nomenclatures'
import Script from 'next/script'
import {
  formatNomenclatureAddress,
  formatPrice,
  getNomenclatureTitle,
} from '@/utils/nomenclatureUtils'
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
import { EntityCard } from '@/components/ui/card/EntityCard'

import { QuickStats } from '@/components/nomenclatureById/detail/QuickStats'
import { PricingTable } from '@/components/nomenclatureById/detail/PricingTable'
import { WhyThisPlace } from '@/components/nomenclatureById/detail/WhyThisPlace'
import { SuitableBusinesses } from '@/components/nomenclatureById/detail/SuitableBusinesses'
import { HowToStartSection } from '@/components/nomenclatureById/detail/HowToStartSection'
import { CTABriefSection } from '@/components/nomenclatureById/detail/CTABriefSection'
import { SimilarPlacements } from '@/components/nomenclatureById/detail/SimilarPlacements'
import { NomenclatureSEOText } from '@/components/nomenclatureById/detail/NomenclatureSEOText'
import { NomenclatureFAQ } from '@/components/nomenclatureById/detail/NomenclatureFAQ'
import PlacesSimpleMap from '@/app/(main)/places/components/PlacesSimpleMap'
import { ICity } from '@/types/cities'

interface NomenclatureDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

const EMPTY_ADDRESS: IAddress = {
  city: '',
  localityType: '',
  street: '',
  streetType: '',
  house: '',
}

function normalizeNomenclature(
  nomenclature: IWebNomenclatureDetailsItem
): INomenclatureDetailsItem {
  const address = nomenclature.address ?? EMPTY_ADDRESS
  const addressName =
    nomenclature.formattedAddress?.name || formatNomenclatureAddress(address)

  return {
    ...nomenclature,
    article: nomenclature.article ?? 0,
    formattedAddress: {
      name: addressName,
      coordinates: nomenclature.formattedAddress?.coordinates ?? {
        latitude: address.coordinates?.latitude ?? '',
        longitude: address.coordinates?.longitude ?? '',
      },
    },
    square: nomenclature.square ?? '',
    address,
    exterior: nomenclature.exterior ?? [],
    interior: nomenclature.interior ?? [],
  }
}

const getNomenclatureById = cache(
  async (slug: string): Promise<INomenclatureDetailsItem | null> => {
    let lastError: unknown

    for (let attempt = 0; attempt < 2; attempt += 1) {
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
          throw new Error(
            `Nomenclature request failed with status ${response.status}`
          )
        }

        const nomenclature: IWebNomenclatureDetailsItem = await response.json()
        return normalizeNomenclature(nomenclature)
      } catch (error) {
        lastError = error
      }
    }

    throw lastError
  }
)

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
  citySlug: string | undefined,
  excludeId: string
): Promise<INomenclatureItem[]> {
  if (!typeOfPlaceName) return []

  try {
    const url = new URL('api/nomenclatures/', process.env.API_1C_URL)
    url.searchParams.set('type_of_place', typeOfPlaceName)
    if (citySlug) url.searchParams.set('city_slug', citySlug)
    url.searchParams.set('limit', '6')

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
      canonical: `${SITE_URL}/nomenclatures/${slug}`,
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
    description,
  } = nomenclature

  const nameForFront = getNomenclatureTitle(nomenclature)
  const nameWhyPlace = `${nomenclature.typeOfPlace?.abbreviation || ''} "${brand ? brand.name : ''}"`

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
    nomenclature.address?.citySlug,
    nomenclature.id
  )

  const nomenclaturesIds = [slug]
  const formattedAddress: string | undefined =
    nomenclature.formattedAddress?.name
  const mapPlace: ICity = {
    id: nomenclature.id,
    title: nameWhyPlace,
    formattedAddress: {
      name: formattedAddress ?? null,
      coordinates: {
        latitude: address.coordinates?.latitude ?? null,
        longitude: address.coordinates?.longitude ?? null,
      },
    },
    pricePerMonth,
    typeOfPlace:
      nomenclature.typeOfPlace?.abbreviation ||
      nomenclature.typeOfPlace?.name ||
      '',
    exterior: exterior.map((image, index) => ({
      source: image.source,
      id: `${nomenclature.id}-${index}`,
    })),
    brand: {
      id: brand?.id ?? '',
      name: brand?.name ?? '',
      logotype: brand?.logotype ?? '',
      slug: brand?.slug ?? '',
    },
  }

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

              <EntityCard className="mt-5 p-0">
                <div className="border-b px-6 py-4">
                  <h2 className="text-xl font-black text-slate-900">
                    Характеристики площадки
                  </h2>
                </div>
                <div className="p-4">
                  <Description nomenclature={nomenclature} />
                </div>
              </EntityCard>
            </div>

            {/* Main info */}
            <div className="space-y-5">
              <EntityCard className="p-6">
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
              </EntityCard>
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
                <EntityCard className="bg-violet-50 p-6 ring-violet-100">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">
                        Ответственный за размещение
                      </h2>
                      <div className="mt-4">
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
                </EntityCard>
              )}
            </div>
          </div>
        </section>

        <WhyThisPlace placeName={nameWhyPlace} />
        <SuitableBusinesses />

        {/* Map + tenants */}
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
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

              <EntityCard tone="muted" className="relative h-[430px] p-0">
                <PlacesSimpleMap places={[mapPlace]} cityName={address.city} />
              </EntityCard>

            </div>

            <div className="mb-5">
              <div className="text-sm font-bold uppercase tracking-wider text-[#ef5350]">
                Арендаторы
              </div>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Кто представлен в ТЦ
              </h2>

              <EntityCard className="p-0">
                <TabsWrapper
                  item={nomenclature}
                  initialTenantsData={tenantsData}
                />
              </EntityCard>
            </div>
          </div>
        </section>

        <HowToStartSection />

        <CTABriefSection
          placeName={nameWhyPlace}
          nomenclaturesIds={nomenclaturesIds}
        />

        <SimilarPlacements
          places={similarPlaces}
          typeOfPlace={nomenclature.typeOfPlace?.name}
          citySlug={nomenclature.address?.citySlug}
        />

        <NomenclatureSEOText
          placeName={nameWhyPlace}
          address={formattedAddress}
          contentType={contentType}
        />

        <NomenclatureFAQ
          placeName={nameWhyPlace}
          pricePerDay={pricePerMonth}
          contentType={contentType}
        />
      </div>
    </>
  )
}
