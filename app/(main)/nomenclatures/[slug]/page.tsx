import {
  Description,
  MapPlacement,
  ResponsibleCard,
  TabsWrapper,
} from '@/components/nomenclatureById'
import { Radio } from 'lucide-react'
import { ITenantsResponse } from '@/types/nomenclature'
import Image from 'next/image'

import {
  generateNomenclatureMetadata,
  generateNomenclatureStructuredData,
  generateNotFoundMetadata,
} from '@/lib/configs/config-meta/nomenclatures'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import { formatPrice } from '@/utils/nomenclatureUtils'
import { EcommerceTracker } from '@/components/ecommerce/EcommerceTracker'
import { AddButtonToOrder } from '@/components/ui/button/AddButtonToOrder'
import BreadcrumbsSetter from '@/components/ui/breadcrumbs/BreadcrumbsSetter'
import ModalFeedBack from '@/components/nomenclatureById/modalFeedBack/ModalFeedBack'
import { SITE_URL } from '@/lib/configs/config-meta/configMetaData'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { notFound } from 'next/navigation'
import Slider from '@/components/slider/Slider'
import { PlaceTitle } from '@/components/nomenclatureById/PlaceTitle'


// const Slider = dynamic(() => import('@/components/slider/Slider'), {
//   ssr: true,
//   loading: () => (
//     <div className="w-full h-full min-h-[320px] bg-gray-100 rounded-md animate-pulse" />
//   ),
// })

interface NomenclatureDetailPageProps {
  params: Promise<{
    slug: string
    // id: string
  }>
}

async function getNomenclatureById(slug: string) {
  try {
    const response = await fetch(
      `${process.env.API_1C_URL}api/nomenclatures/web/${slug}`,
      { cache: 'no-store' }
    )

    // console.log('API response status:', response.status)
    // console.log('API response headers:', response)

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      // console.error('API message:', response.statusText)
      // console.error('API response body:', await response.text())
      // console.error('API error:', response.status)
      return null
    }

    return await response.json()
  } catch (e) {
    // console.error('Network error:', e)
    return null
  }
}

async function getTenantsByNomenclatureId(id: string): Promise<ITenantsResponse | null> {
  // console.log('Fetching tenants for nomenclature ID:', id)
  try {
    const url = new URL(`api/nomenclatures/${id}/tenant/?limit=25&offset=0`, process.env.API_1C_URL)

    const response = await fetch(url.toString(), {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // console.log('Tenants API response headers:', response)

    if (!response.ok) return null
    return response.json()
  } catch (error) {
    // console.error('Error fetching tenants:', error)
    return null
  }
}

export async function generateMetadata(props: any) {
  // console.log('start meta')
  const params = await props.params
  // console.log('params meta', params)
  const { slug } = params
  // console.log('id from params meta', slug)

  const nomenclature = await getNomenclatureById(slug)

  if (!nomenclature) {
    return generateNotFoundMetadata()
  }

  const metadata = generateNomenclatureMetadata({ nomenclature, id: slug })

  // Добавить canonical URL
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
    // main_info
    description,
  } = nomenclature

  // const { description } = main_info

  const allImages = [...exterior, ...interior]

  const structuredData = generateNomenclatureStructuredData(nomenclature, slug)
  const breadcrumbItems = [
    { name: 'Главная', url: `${SITE_URL}` },
    { name: 'Места для рекламы', url: `${SITE_URL}/nomenclatures` },
    { name: nameForFront, url: `${SITE_URL}/nomenclatures/${slug}` },
  ]

  // console.log('NOMENCLATURE:', nomenclature)
  const tenantsData = await getTenantsByNomenclatureId(nomenclature.id)

  const nomenclaturesIds = [slug]
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {/* E-commerce отслеживание просмотра товара */}
      <EcommerceTracker
        item={{
          item_id: slug,
          item_name: nameForFront,
          item_category: contentType,
          item_brand: brand?.name,
          price: pricePerMonth,
        }}
      />
      <BreadcrumbsSetter title={`${nomenclature.typeOfPlace.abbreviation} ${nomenclature.brand ? nomenclature.brand.name : ''}`} />
      <div className="flex flex-col bg-gray-200 w-full h-full">
        <Script
          id={`structured-data-${slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
          strategy="afterInteractive"
        />
        <div className="flex flex-col sm:flex-row gap-1 p-2 w-full h-full overflow-auto bg-[var(--background)]">
          <div className="flex flex-col gap-2 w-full sm:w-3/5 h-auto">
            {/* Слайдер с изображениями или логотип */}
            <div className="w-full min-h-80 sm:h-70 rounded-md shadow-sm overflow-hidden relative">
              {allImages.length > 0 ? (
                <Slider images={allImages} autoPlay={true} autoPlayTime={15000} />
              ) : (
                <div className="w-full h-full min-h-[320px] bg-gray-100 flex items-center justify-center p-4">
                  {brand && (
                    <>
                      {brand.logotype ? (
                        <Image
                          src={brand.logotype}
                          alt="Логотип"
                          width={200}
                          height={100}
                          className="object-contain max-h-full w-auto"
                          loading="lazy"
                        />
                      ) : (
                        <Image
                          src="/og-logo.jpg"
                          alt="Логотип"
                          width={200}
                          height={100}
                          className="object-contain"
                          loading="lazy"
                        />
                      )}
                    </>
                  )}

                </div>
              )}
            </div>

            <div className="w-full hidden md:block">
              <Description nomenclature={nomenclature} />
            </div>



          </div>

          <div className="flex flex-col w-full sm:overflow-y-auto rounded-md shadow-xl">
            <div className="p-4 border-b">
              <div className='flex flex-row gap-3 items-center mb-2'>
                {brand && (
                  <>
                    {brand.logotype && (
                      <span className="items-center flex">
                        <Image
                          src={brand.logotype}
                          alt="Логотип"
                          width={180}
                          height={60}
                          className="object-contain max-h-full w-auto"
                          loading='lazy'
                        />
                      </span>
                    )}
                  </>
                )}
                <PlaceTitle place={nomenclature} variant="full" />

              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {contentType && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded items-center flex">
                    {contentType}
                  </span>
                )}
                {pricePerMonth && (
                  <div className="flex flex-col bg-orange-100 rounded gap-0 px-2 py-1 items-center justify-center">
                    <span className="text-lg">
                      Стоимость: от {formatPrice(pricePerMonth)}/день
                    </span>
                    <span className="text-xs">*при размещении от 1 месяца</span>
                  </div>
                )}
                <AddButtonToOrder item={nomenclature} />
                <ModalFeedBack pathName='nomenclatures' nomenclaturesIds={nomenclaturesIds} />
              </div>
            </div>
            {description && (
              <>
                {/* <hr className="solid ml-4 mr-4" /> */}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-[#1E3961]">
                    Описание
                  </h2>
                  <span className="px-2 py-1 rounded items-center flex text-base sm:text-lg text-gray-700 whitespace-pre-line">
                    {description}
                  </span>
                </div>
                <hr className="solid ml-4 mr-4" />
              </>
            )}
            {responsible?.ad && (
              <>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-[#1E3961]">
                    Ответственный
                  </h2>

                  <div className="flex flex-col gap-4">
                    <ResponsibleCard
                      label="за размещения"
                      icon={<Radio size={16} />}
                      phoneNumber={responsible?.ad?.phone_number}
                      name={responsible?.ad?.full_name || 'Не указан'}
                      color="bg-purple-100"
                    />
                  </div>
                </div>

                <hr className="solid ml-4 mr-4" />
              </>
            )}
            {nomenclature && (
              <div>
                <div className="w-full h-full sm:h-2/3 block md:hidden p-4">
                  <Description nomenclature={nomenclature} />

                </div>
              </div>
            )}

            {/* Место вещания */}
            {address && (
              <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-row items-center gap-12">
                  <h2 className="text-xl font-semibold text-[#1E3961]">
                    На карте
                  </h2>
                </div>
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
                />
              </div>
            )}
            <TabsWrapper item={nomenclature} initialTenantsData={tenantsData} />
          </div>
        </div>
      </div>
    </>
  )
}
