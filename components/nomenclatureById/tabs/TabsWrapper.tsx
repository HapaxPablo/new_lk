'use client'

import React from 'react'
import { NamedTabs } from '@/components/Tabs'
import { INomenclatureDetailsItem, ITenantsResponse } from '@/types/nomenclature'

interface IProps {
  item: INomenclatureDetailsItem
  initialTenantsData: ITenantsResponse | null
}

export const TabsWrapper = ({ item, initialTenantsData }: IProps) => {
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
