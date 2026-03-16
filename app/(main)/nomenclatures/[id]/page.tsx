import {
  Description,
  MapPlacement,
  ResponsibleCard,
  TabsWrapper,
} from '@/components/nomenclatureById'
import { BrandInfoTooltip } from '@/components/ui/tooltip/BrandInfoTooltip'
import { Radio, MapPinned, BoomBox, ToolCase } from 'lucide-react'
import { INomenclatureDetailsItem } from '@/types/nomenclature'
import { Metadata } from 'next'
import Image from 'next/image'

import {
  generateNomenclatureMetadata,
  generateNomenclatureStructuredData,
  generateNotFoundMetadata,
} from '@/lib/configs/config-meta/nomenclatures'
import Script from 'next/script'
import { DeviceStatusBadge } from '@/components/ui/device/DeviceStatusBadge'
import { TStatusType } from '@/types/nomenclature/status'
import dynamic from 'next/dynamic'
import { NmcFragment } from '@/components/nomenclatureById/description/fragment/NmcFragment'
import { formatPrice } from '@/utils/nomenclatureUtils'

const Slider = dynamic(() => import('@/components/slider/Slider'), {
  ssr: true,
  loading: () => (
    <div className="w-full h-full min-h-[320px] bg-gray-100 rounded-md animate-pulse" />
  ),
})
interface NomenclatureDetailPageProps {
  params: Promise<{
    id: string
  }>
}

async function getNomenclatureById(
  id: string
): Promise<INomenclatureDetailsItem | null> {
  try {
    if (!process.env.API_1C_URL) {
      throw new Error('API_1C_URL environment variable is not defined')
    }

    const baseUrl = new URL('api/nomenclatures/', process.env.API_1C_URL)
    const finalUrl = new URL(`${id}/`, baseUrl)

    // console.log(`Fetching nomenclature from: ${finalUrl.toString()}`)

    const response = await fetch(finalUrl.toString(), {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`)
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching nomenclature:', {
      message: error,
      id: id,
      environment: process.env.NODE_ENV,
      apiUrl: process.env.API_1C_URL,
    })
    return null
  }
}

export async function generateMetadata(
  props: NomenclatureDetailPageProps
): Promise<Metadata> {
  const params = await props.params
  const { id } = params

  const nomenclature = await getNomenclatureById(id)

  if (!nomenclature) {
    return generateNotFoundMetadata()
  }

  return generateNomenclatureMetadata({ nomenclature, id })
}

export default async function NomenclatureDetailPage(
  props: NomenclatureDetailPageProps
) {
  const params = await props.params
  const { id } = params
  const nomenclature = await getNomenclatureById(id)
  // console.log('DETAILS', nomenclature)

  if (!nomenclature) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h1 className="text-xl font-bold mb-2">Номенклатура не найдена</h1>
          <p>
            Запрошенная номенклатура с ID {id} не существует или была удалена.
          </p>
        </div>
      </div>
    )
  }

  const {
    article,
    brand,
    exterior,
    interior,
    pricePerMonth,
    main_info,
    contentType,
    typeOfPlace,
    legalEntity,
    address,
    hw_info,
    responsible,
    nameForFront,
  } = nomenclature

  const allImages = [...exterior, ...interior]

  const structuredData = generateNomenclatureStructuredData(nomenclature, id)

  return (
    <>
      <Script
        id={`structured-data-${id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
        strategy="afterInteractive"
      />

      <div className="flex flex-col sm:flex-row gap-1 p-4 w-full h-full overflow-auto">
        <div className="flex flex-col gap-2 w-full sm:w-3/5 h-auto">
          {/* Слайдер с изображениями или логотип */}
          <div className="w-full min-h-80 sm:h-70 rounded-md shadow-sm overflow-hidden relative">
            {allImages.length > 0 ? (
              <Slider images={allImages} autoPlay={true} autoPlayTime={15000} />
            ) : (
              <div className="w-full h-full min-h-[320px] bg-gray-100 flex items-center justify-center p-4">
                {brand.logotype ? (
                  <Image
                    src={brand.logotype}
                    alt="Логотип"
                    width={200}
                    height={100}
                    className="object-contain max-h-full w-auto"
                  />
                ) : (
                  <Image
                    src="/og-logo.jpg"
                    alt="Логотип"
                    width={200}
                    height={100}
                    className="object-contain"
                  />
                )}
              </div>
            )}
          </div>

          {/* Описание */}
          <div className="w-full h-full sm:h-2/3 ">
            <Description nomenclature={nomenclature} />
          </div>
        </div>

        <div className="flex flex-col w-full sm:overflow-y-auto rounded-md shadow-xl">
          {/* Заголовок и основная информация */}
          <div className="p-4 border-b">
            <span className="text-sm sm:text-2xl font-bold text-[#1E3961] mb-2">
              {nameForFront}
            </span>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded items-center flex">
                {contentType}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded items-center flex">
                {typeOfPlace}
              </span>
              {}
              {/* <DeviceStatusBadge
                status={nomenclature.main_info.status as TStatusType}
                size="md"
                answer={nomenclature.main_info?.last_answer}
              /> */}
              <div className="flex flex-col bg-orange-100 rounded gap-0 px-2 py-1 items-center">
                <span className="text-lg">
                  Стоимость: от {formatPrice(pricePerMonth)}/день
                </span>
                <span className="text-xs">*при размещении от 1 месяца</span>
              </div>
            </div>
          </div>

          {/* Ответственные лица */}
          <div className="p-4">
            <h2 className="text-xl font-semibold text-[#1E3961]">
              Ответственный
            </h2>

            <div className="flex flex-col gap-4">
              <ResponsibleCard
                label="Реклама"
                icon={<Radio size={16} />}
                phoneNumber={responsible?.ad?.phone_number}
                name={responsible?.ad?.full_name || 'Не указан'}
                color="bg-purple-100"
              />
            </div>
          </div>

          <hr className="solid m-4" />

          {/* Место вещания */}
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-row items-center gap-12">
              <h2 className="text-xl font-semibold text-[#1E3961]">
                Место вещания
              </h2>
              <BrandInfoTooltip brand={brand} />
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
              // name={main_info.name}
              // address={nomenclature.address}
            />
          </div>

          <hr className="solid m-4" />

          <TabsWrapper item={nomenclature} />
        </div>
      </div>
    </>
  )
}
