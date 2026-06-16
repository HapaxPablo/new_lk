'use client'

import React from 'react'
import { NamedTabs } from '@/components/Tabs'
import { INomenclatureDetailsItem, ITenantsResponse } from '@/types/nomenclature'

interface IProps {
  item: INomenclatureDetailsItem
  initialTenantsData: ITenantsResponse | null
}

export const TabsWrapper = ({ item, initialTenantsData }: IProps) => {
  console.log('TabsWrapper item', item)
  console.log('TabsWrapper initialTenantsData', initialTenantsData)
  if (!item) {
    return (
      <div
        style={{
          padding: '1rem',
          textAlign: 'center',
          color: 'var(--second-text-color)',
        }}
      >
        Данные для отображения отсутствуют
      </div>
    )
  }

  return (
    <section aria-label="Дополнительная информация">
      <NamedTabs item={item} initialTenantsData={initialTenantsData} />
    </section>
  )
}
