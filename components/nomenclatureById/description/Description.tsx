import React from 'react'
import { NmcFragment } from './fragment/NmcFragment'

interface DescriptionProps {
    article: string
    operator: string
    legalEntity: string
    brand: string
    typesOfMedia: string
    typePlace: string
    typeContent: string
    address: string
    contact: string
}

export function Description() {

    const defaultValue: DescriptionProps = {
        article: '2385',
        operator: 'Агентство активной рекламы, ООО (RMC)',
        legalEntity: 'Плисевич Д. Б.',
        brand: 'Апельсин',
        typesOfMedia: 'Внутренние громкоговорители',
        typePlace: 'Торговый центр',
        typeContent: 'Аудио',
        address: 'Сибирский, Краноярский, Красноярск,  Красной Армии, 109',
        contact: '+7 999 999 99 99'
    }

    return (
        <div className='p-6 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow gap-4 flex flex-col items-start justify-between'>
            <NmcFragment text={defaultValue.article} type='Артикул' />
            <NmcFragment text={defaultValue.operator} type='Оператор' />
            <NmcFragment text={defaultValue.legalEntity} type='Юр. Лицо' />
            <NmcFragment text={defaultValue.brand} type='Бренд' />
            <NmcFragment text={defaultValue.typesOfMedia} type='Типы носителей' />
            <NmcFragment text={defaultValue.typePlace} type='Место' />
            <NmcFragment text={defaultValue.typeContent} type='Тип вещания' />
            <NmcFragment text={defaultValue.address} type='Адрес' />
            <NmcFragment text={defaultValue.contact} type='Контактны' />
        </div>
    )
}
