import {
  ArticleDiv,
  Description,
  MapPlacement,
  ResponsibleCard,
  TabsWrapper,
} from '@/components/nomenclatureById'
import Slider from '@/components/slider/Slider'
import { Wrench, Radio, Megaphone, MapPin } from 'lucide-react'
import { INomenclatureDetailsItem } from '@/types/nomenclature'
import { Metadata } from 'next'
import { formatPrice, isDeviceOnline } from '@/utils'
import {
  generateNomenclatureMetadata,
  generateNomenclatureStructuredData,
  generateNotFoundMetadata,
} from '@/lib/configs/config-meta/nomenclatures'
import Script from 'next/script'

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

    console.log(`Fetching nomenclature from: ${finalUrl.toString()}`)

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

// Генерация метаданных для SEO
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

  // Загружаем данные номенклатуры через ваш API endpoint
  const nomenclature = await getNomenclatureById(id)
  console.log('NOMENCL', nomenclature)

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
    hw_info,
  } = nomenclature

  // Объединяем все изображения
  const allImages = [...exterior, ...interior]

  // Генерируем structured data для SEO
  const structuredData = generateNomenclatureStructuredData(nomenclature, id)

  return (
    <>
      {/* JSON-LD structured data для SEO */}
      <Script
        id={`structured-data-${id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
        strategy="afterInteractive"
      />

      <div className="flex flex-row gap-1 p-4 w-full h-full">
        <div className="flex flex-col gap-2 w-2/5 h-auto">
          {/* Слайдер с изображениями */}
          <div className="w-full rounded-md shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <Slider
              // images={allImages.map(img => img.source)}
              autoPlay={true}
              autoPlayTime={1500}
            />
          </div>

          {/* Описание */}
          <div className="w-full h-auto">
            <Description nomenclature={nomenclature} />
          </div>
        </div>

        <div className="flex flex-col w-full bg-white overflow-y-auto rounded-md shadow-sm hover:shadow-md transition-shadow">
          {/* Заголовок и основная информация */}
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold text-[#1E3961] mb-2">
              {main_info.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {contentType}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                {typeOfPlace}
              </span>
              <span
                className={`px-2 py-1 rounded ${
                  isDeviceOnline(nomenclature)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {isDeviceOnline(nomenclature) ? 'Онлайн' : 'Офлайн'}
              </span>
            </div>
          </div>

          {/* Ответственные лица */}
          <div className="flex flex-col gap-4 p-4">
            <h2 className="text-xl font-semibold text-[#1E3961]">
              Ответственный
            </h2>

            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
              // style={{ gridTemplateRows: 'repeat(2, 1fr)' }}
            >
              <ResponsibleCard
                label="Бренд радио"
                icon={<Radio size={16} />}
                data={brand?.name || 'Не указан'}
                color="bg-purple-100"
              />
              <ResponsibleCard
                label="Техника"
                icon={<Wrench size={16} />}
                data={hw_info.model || 'Не указано'}
                color="bg-green-100"
              />
              <ResponsibleCard
                label="Реклама"
                icon={<Megaphone size={16} />}
                data={legalEntity || 'Не указано'}
                color="bg-blue-100"
              />
              <ResponsibleCard
                label="Размещение"
                icon={<MapPin size={16} />}
                data={formatPrice(pricePerMonth)}
                color="bg-red-100"
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
              <ArticleDiv article={String(article)} />
            </div>
            <MapPlacement
              lat={56.011152}
              lng={92.814753}
              // name={main_info.name}
              // address={nomenclature.address}
            />
          </div>

          <hr className="solid m-4" />

          {/* Табы с дополнительной информацией */}
          <TabsWrapper
          // nomenclature={nomenclature}
          />
        </div>
      </div>
    </>
  )
}
