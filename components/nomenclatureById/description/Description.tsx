'use client'
import React from 'react'
import { NmcFragment } from './fragment/NmcFragment'
import { INomenclatureDetailsItem } from '@/types/nomenclature'
import { formatMediaUnits, formatPossibility, formatSquare, formatWorkTime } from '@/utils/nomenclatureUtils'

interface DescriptionProps {
  nomenclature?: INomenclatureDetailsItem | null
}

export function Description({ nomenclature }: DescriptionProps) {
  // Проверяем, что nomenclature существует
  if (!nomenclature) {
    return (
      <div className="h-full p-6 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow gap-4 flex flex-col items-start justify-between">
        <div className="text-gray-500 text-center w-full">
          Данные номенклатуры не загружены
        </div>
      </div>
    )
  }

  // Деструктурируем с значениями по умолчанию
  const {
    article = 0,
    legalEntity = { id: '', name: '' },
    brand,
    contentType = '',
    typeOfPlace = '',
    formattedAddress,
    main_info = {
      owner: { full_name: '' },
      name: '',
    },
    external_audio_media,
    external_video_media,
    internal_video_media,
    internal_audio_media,
    worktime_start,
    worktime_end,
    square,
    possibility,
  } = nomenclature


  const displayData = {
    article: article ? String(article) : '',
    legalEntity: legalEntity || '',
    brand: brand?.name || '',
    typesOfMedia: contentType || '',
    typePlace: typeOfPlace || '',
    typeContent: contentType || '',
    address: formattedAddress?.name || '',
    externalAudioMedia: external_audio_media || '',
    externalVideoMedia: external_video_media || '',
    internalVideoMedia: internal_video_media || '',
    internalAudioMedia: internal_audio_media || '',
    worktimeStart: worktime_start || '',
    worktimeEnd: worktime_end || '',
    square: square || '',
    possibility: possibility || '',
  }

  const handleRedirectToBrand = () => {
    if (brand?.slug) {
      window.open(`/brands/${brand.slug}`, '_blank')
    }
  }

  return (
    <div className="gap-2 p-2 rounded-md shadow-sm flex flex-col sm:overflow-y-auto">
      {/* {displayData.article && (
        <NmcFragment text={displayData.article} type="Артикул" />
      )} */}
      {/* {displayData.legalEntity && (
        <NmcFragment text={displayData.legalEntity.name} type="Юр. Лицо" />
      )} */}
      {displayData.typePlace && (
        <NmcFragment text={displayData.typePlace} type="Место" />
      )}
      {displayData.brand && (
        <NmcFragment text={displayData.brand} type="Бренд" onClick={handleRedirectToBrand} className='cursor-pointer hover:underline text-blue-600!' />
      )}

      {worktime_start && worktime_end && (
        <NmcFragment text={formatWorkTime(worktime_start, worktime_end)} type="Время работы" />
      )}
      {displayData.address && (
        <NmcFragment text={displayData.address} type="Адрес" />
      )}

      {displayData.externalAudioMedia && (
        <NmcFragment
          text={formatMediaUnits(displayData.externalAudioMedia)}
          type="Уличные громкоговорители"
        />
      )}
      {displayData.externalVideoMedia && (
        <NmcFragment
          text={formatMediaUnits(displayData.externalVideoMedia)}
          type="Уличные видеомониторы"
        />
      )}
      {displayData.internalVideoMedia && (
        <NmcFragment
          text={formatMediaUnits(displayData.internalVideoMedia)}
          type="Внутренние видеомониторы"
        />
      )}
      {displayData.internalAudioMedia && (
        <NmcFragment
          text={formatMediaUnits(displayData.internalAudioMedia)}
          type="Внутренние громкоговорители"
        />
      )}
      {displayData.square && (
        <NmcFragment text={formatSquare(displayData.square)} type="Площадь" />
      )}
      {displayData.possibility && (
        <NmcFragment text={formatPossibility(displayData.possibility)} type="Проходимость" />
      )}
    </div>
  )
}
