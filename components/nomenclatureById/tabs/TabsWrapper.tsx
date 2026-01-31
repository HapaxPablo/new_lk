'use client'

import React from 'react'
import { NamedTabs } from '@/components/Tabs'
import { INomenclatureDetailsItem } from '@/types/nomenclature'

interface IProps {
  item: INomenclatureDetailsItem
}

export const TabsWrapper = ({ item }: IProps) => {
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
      <NamedTabs item={item} />
    </section>
  )
}
