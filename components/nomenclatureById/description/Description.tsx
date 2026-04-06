import React from 'react'
import { NmcFragment } from './fragment/NmcFragment'
import { INomenclatureDetailsItem } from '@/types/nomenclature'

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
    hw_info = {
      model: '',
      serial_number: '',
    },
    pricePerMonth = '0',
    external_audio_media,
    external_video_media,
    internal_video_media,
    internal_audio_media,
    worktime_start,
    worktime_end,
    square,
    possibility,
  } = nomenclature

  const ownerName = main_info?.owner?.full_name || ''
  const mainName = main_info?.name || ''

  const displayData = {
    article: article ? String(article) : '',
    operator: ownerName,
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

  return (
    <div className="gap-2 p-2 rounded-md shadow-sm flex flex-col sm:overflow-y-auto">
      {/* {displayData.article && (
        <NmcFragment text={displayData.article} type="Артикул" />
      )} */}

      {displayData.operator && (
        <NmcFragment text={displayData.operator} type="Оператор" />
      )}
      {/* {displayData.legalEntity && (
        <NmcFragment text={displayData.legalEntity.name} type="Юр. Лицо" />
      )} */}
      {displayData.typePlace && (
        <NmcFragment text={displayData.typePlace} type="Место" />
      )}
      {displayData.brand && (
        <NmcFragment text={displayData.brand} type="Бренд" />
      )}

      {/* {displayData.typeContent && (
        <NmcFragment text={displayData.typeContent} type="Тип вещания" />
      )} */}
      {displayData.address && (
        <NmcFragment text={displayData.address} type="Адрес" />
      )}

      {displayData.externalAudioMedia && (
        <NmcFragment
          text={displayData.externalAudioMedia}
          type="Кол-во внешних аудио носителей"
        />
      )}
      {displayData.externalVideoMedia && (
        <NmcFragment
          text={displayData.externalVideoMedia}
          type="Кол-во внешних видео носителей"
        />
      )}
      {displayData.internalVideoMedia && (
        <NmcFragment
          text={displayData.internalVideoMedia}
          type="Кол-во внутренних видео носителей"
        />
      )}
      {displayData.internalAudioMedia && (
        <NmcFragment
          text={displayData.internalAudioMedia}
          type="Кол-во внутренних аудио носителей"
        />
      )}
      {displayData.square && (
        <NmcFragment text={displayData.square} type="Площадь" />
      )}
      {displayData.possibility && (
        <NmcFragment text={displayData.possibility} type="Проходимость" />
      )}
    </div>
  )
}
