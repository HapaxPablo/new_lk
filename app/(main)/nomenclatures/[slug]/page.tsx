// app/(main)/nomenclatures/[slug]/page.tsx
import {
  ResponsibleCard,
  TabsWrapper,
  Description,
  PriceTableButton,
} from '@/components/nomenclatureById'
import { Radio } from 'lucide-react'
import {
  IAddress,
  IImage,
  INomenclatureDetailsItem,
  INomenclatureItem,
  ITenantsResponse,
  IWebNomenclatureDetailsItem,
} from '@/types/nomenclature'
import Image from 'next/image'
import { Montserrat_Alternates } from 'next/font/google'

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
import { WhyThisPlace } from '@/components/nomenclatureById/detail/WhyThisPlace'
import { SuitableBusinesses } from '@/components/nomenclatureById/detail/SuitableBusinesses'
import { HowToStartSection } from '@/components/nomenclatureById/detail/HowToStartSection'
import { CTABriefSection } from '@/components/nomenclatureById/detail/CTABriefSection'
import { SimilarPlacements } from '@/components/nomenclatureById/detail/SimilarPlacements'
import { NomenclatureSEOText } from '@/components/nomenclatureById/detail/NomenclatureSEOText'
import { NomenclatureFAQ } from '@/components/nomenclatureById/detail/NomenclatureFAQ'
import { ICity } from '@/types/cities'
import UnifiedMap, { MapMarker } from '@/components/maps/UnifiedMap'
import { parseCoordinates } from '@/components/maps/adapters'
import { Button } from '@/components/ui/button/Button'
import { calculateMonthlyExits } from '@/utils'

const montserratAlternates = Montserrat_Alternates({
  weight: ['400', '500', '600', '700'],
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
})

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

function getExitWord(slotsPerHour: string): string {
  const count = Number(slotsPerHour)

  if (!Number.isInteger(count)) return 'выходов'

  const lastTwoDigits = Math.abs(count) % 100
  const lastDigit = Math.abs(count) % 10

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'выходов'
  if (lastDigit === 1) return 'выход'
  if (lastDigit >= 2 && lastDigit <= 4) return 'выхода'

  return 'выходов'
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
          `${process.env.API_1C_URL}api/nomenclatures/web/${encodeURIComponent(slug)}/`,
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

async function getNomenclatureVideos(id: string): Promise<IImage[]> {
  try {
    const url = new URL(
      `api/videos/${id}/get_nomenclature_videos/`,
      process.env.API_1C_URL
    )

    const response = await fetch(url.toString(), { cache: 'no-store' })
    if (!response.ok) return []

    const data = await response.json()
    const list: any[] = Array.isArray(data) ? data : data?.results || []

    return list
      .map((item) => ({
        source: item.source || item.url || item.video || '',
        type: 'video' as const,
      }))
      .filter((item) => Boolean(item.source))
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

  const nomenclatureVideos = await getNomenclatureVideos(nomenclature.id)

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

  const coordinates = parseCoordinates(
    address.coordinates ?? nomenclature.formattedAddress?.coordinates
  )
  const mapMarkers: MapMarker[] = coordinates
    ? [
        {
          id: nomenclature.id,
          coordinates,
          title: nameWhyPlace || 'Рекламная площадка',
          address: formattedAddress,
          imageUrl: exterior[0]?.source,
          logoUrl: brand?.logotype,
        },
      ]
    : []

  const allImages = [...exterior, ...interior, ...nomenclatureVideos]

  console.log('nomenclature', nomenclature)

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

      <div
        className={`${montserratAlternates.className} bg-slate-50 text-slate-900 overflow-auto`}
      >
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
                        quality={60}
                        className="max-h-full w-auto object-contain"
                        loading="lazy"
                      />
                    )}
                  </div>
                )}
                {/* </div> */}
              </div>
              {pricePerMonth && (
                <EntityCard className="mt-5 p-0">
                  <div className="flex flex-col justify-between px-6 py-4">
                    <h2 className="text-xl font-black text-[#ff6b61]">
                      Размещение
                    </h2>

                    <span className="text-2xl font-black text-[#183973]">
                      От: {formatPrice(pricePerMonth)}/день
                    </span>

                    <div className="border-b-2 border-[#dce6f0] mb-4 mt-4" />

                    <div className="flex items-center gap-2 text-base font-bold text-slate-700">
                      <span>{nomenclature.typeOfPlace.abbreviation}</span>
                      <span>·</span>
                      <span>{contentType}</span>
                    </div>

                    {nomenclature.slots_per_hour && (
                      <div className="flex items-center gap-2 text-base font-bold text-slate-700">
                        <span className="text-lg font-bold text-slate-700">
                          {nomenclature.slots_per_hour}{' '}
                          {getExitWord(nomenclature.slots_per_hour)} в час
                        </span>
                        <span>·</span>
                        {nomenclature.worktime_start &&
                          nomenclature.worktime_end &&
                          nomenclature.slots_per_hour && (
                            <span>
                              {calculateMonthlyExits({
                                worktime_start: nomenclature.worktime_start,
                                worktime_end: nomenclature.worktime_end,
                                slots_per_hour: nomenclature.slots_per_hour,
                              })}
                            </span>
                          )}
                      </div>
                    )}

                    {nomenclature.tariffs && (
                      <div className="mt-2 text-base font-bold text-slate-700">
                        Тарифы: {nomenclature.tariffs}
                      </div>
                    )}

                    <PriceTableButton nomenclatureId={nomenclature.id} />
                  </div>
                </EntityCard>
              )}
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
                  <a
                    href={`/brands/${brand.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-3 inline-flex rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-500! hover:bg-orange-100 hover:text-orange-600!"
                  >
                    {brand.name}
                  </a>
                )}

                <PlaceTitle place={nomenclature} variant="full" />

                {description && (
                  <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-8 text-slate-600">
                    {description}
                  </p>
                )}

                {/* {pricePerMonth && (
                    <span className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                      Стоимость: от {formatPrice(pricePerMonth)}/день
                    </span>
                  )}
                  <span className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
                    При размещении от 1 месяца
                  </span> */}

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

              <EntityCard tone="muted" className="relative h-107.5 p-0">
                <UnifiedMap
                  markers={mapMarkers}
                  cluster={false}
                  fit="markers"
                />
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
