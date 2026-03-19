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
    </div>
  )
}
