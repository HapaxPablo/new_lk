// app/(main)/nomenclatures/[slug]/page.tsx
import {
  ResponsibleCard,
  TabsWrapper,
  Description,
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { QuickStats } from '@/components/nomenclatureById/detail/QuickStats'
import { PricingTable } from '@/components/nomenclatureById/detail/PricingTable'
import { WhyThisPlace } from '@/components/nomenclatureById/detail/WhyThisPlace'
import { SuitableBusinesses } from '@/components/nomenclatureById/detail/SuitableBusinesses'
import { HowToStartSection } from '@/components/nomenclatureById/detail/HowToStartSection'
import { CTABriefSection } from '@/components/nomenclatureById/detail/CTABriefSection'
import { SimilarPlacements } from '@/components/nomenclatureById/detail/SimilarPlacements'
import { NomenclatureSEOText } from '@/components/nomenclatureById/detail/NomenclatureSEOText'
import { NomenclatureFAQ } from '@/components/nomenclatureById/detail/NomenclatureFAQ'
import UnifiedMap from '@/components/maps/UnifiedMap'
import { parseCoordinates } from '@/components/maps/adapters'
import type { MapMarker } from '@/components/maps/types'

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
  const coordinates = parseCoordinates(address.coordinates)
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

              <Card className="mt-5">
                <CardHeader className="border-b">
                  <CardTitle>Характеристики площадки</CardTitle>
                </CardHeader>
                <CardContent>
                  <Description nomenclature={nomenclature} />
                </CardContent>
              </Card>
            </div>

            {/* Main info */}
            <div className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle className="sr-only">
                    Основная информация о площадке
                  </CardTitle>
                  {brand?.name && <Badge variant="outline">{brand.name}</Badge>}
                  <PlaceTitle place={nomenclature} variant="full" />
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  {description && (
                    <p className="max-w-3xl whitespace-pre-line text-base leading-8 text-muted-foreground">
                      {description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {contentType && (
                      <Badge variant="secondary">{contentType}</Badge>
                    )}
                    {pricePerMonth && (
                      <Badge variant="outline">
                        Стоимость: от {formatPrice(pricePerMonth)}/день
                      </Badge>
                    )}
                    <Badge variant="outline">При размещении от 1 месяца</Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 sm:flex-row">
                  <AddButtonToOrder item={nomenclature} />
                  <ModalFeedBack
                    pathName="nomenclatures"
                    nomenclaturesIds={nomenclaturesIds}
                  />
                </CardFooter>
              </Card>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Ответственный за размещение</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsibleCard
                      label="за размещения"
                      icon={<Radio size={16} />}
                      phoneNumber={responsible?.ad?.phone_number}
                      name={responsible?.ad?.full_name || 'Не указан'}
                      color=""
                    />
                  </CardContent>
                  <CardFooter className="text-muted-foreground">
                    Поможет уточнить условия, сроки запуска и подготовить
                    медиаплан.
                  </CardFooter>
                </Card>
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
              <Card>
                <CardHeader>
                  <Badge variant="outline">На карте</Badge>
                  <CardTitle>Адрес размещения</CardTitle>
                  {formattedAddress && (
                    <p className="text-muted-foreground">{formattedAddress}</p>
                  )}
                </CardHeader>
                <CardContent className="h-[430px] px-0">
                  <UnifiedMap
                    markers={mapMarkers}
                    cluster={false}
                    fit="markers"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="mb-5">
              <Card>
                <CardHeader>
                  <Badge variant="outline">Арендаторы</Badge>
                  <CardTitle>Кто представлен в ТЦ</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <TabsWrapper
                    item={nomenclature}
                    initialTenantsData={tenantsData}
                  />
                </CardContent>
              </Card>
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
