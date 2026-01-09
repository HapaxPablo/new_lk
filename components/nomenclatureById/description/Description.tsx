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
    legalEntity = {id: '', name: ''},
    brand,
    contentType = '',
    typeOfPlace = '',
    address,
    main_info = {
      owner: { full_name: '' },
      name: ''
    },
    hw_info = {
      model: '',
      serial_number: ''
    },
    pricePerMonth = '0'
  } = nomenclature

  const ownerName = main_info?.owner?.full_name || 'Не указан'
  const mainName = main_info?.name || ''

  const displayData = {
    article: article ? String(article) : 'Не указан',
    operator: ownerName,
    legalEntity: legalEntity || 'Не указано',
    brand: brand?.name || 'Не указан',
    typesOfMedia: contentType || 'Не указан',
    typePlace: typeOfPlace || 'Не указано',
    typeContent: contentType || 'Не указан',
    address: address || 'Не указан',
    contact: ownerName
  }

  return (
    <div className="h-full p-2 rounded-md shadow-sm gap-2 flex flex-col sm:overflow-y-auto">
      <NmcFragment text={displayData.article} type="Артикул" />
      <NmcFragment text={displayData.operator} type="Оператор" />
      <NmcFragment text={displayData.legalEntity.name} type="Юр. Лицо" />
      <NmcFragment text={displayData.brand} type="Бренд" />
      <NmcFragment text={displayData.typesOfMedia} type="Типы носителей" />
      <NmcFragment text={displayData.typePlace} type="Место" />
      <NmcFragment text={displayData.typeContent} type="Тип вещания" />
      <NmcFragment text={displayData.address.full_address} type="Адрес" />
      <NmcFragment text={displayData.contact} type="Контактны" />
    </div>
  )
}