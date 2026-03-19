'use client'

import { ITenantsListItem } from '@/types/nomenclature'
import Image from 'next/image'
import React, { useState } from 'react'

interface RentersTabContentProps {
  tenants: ITenantsListItem[]
}

const TenantLogo = ({ tenant }: { tenant: ITenantsListItem }) => {
  const [hasError, setHasError] = useState(false)
  const [shouldRender, setShouldRender] = useState(
    tenant.logotypes && tenant.logotypes.length > 0
  )

  // Если нет логотипа или была ошибка загрузки, не рендерим
  if (!shouldRender || hasError) {
    return null
  }

  return (
    <Image
      src={tenant.logotypes![0]}
      alt={`${tenant.brands_list} логотип`}
      width={120}
      height={120}
      className="object-contain mr-2"
      onError={() => setHasError(true)} // При ошибке загрузки скрываем изображение
    />
  )
}

export const RentersTabContent = ({ tenants }: RentersTabContentProps) => {
  if (tenants.length === 0) {
    return <p>Арендаторы не найдены</p>
  }

  return (
    <ul className="overflow-auto max-h-96 pr-2">
      {tenants.map((tenant, index) => (
        <li
          key={tenant.id || index}
          className="flex items-center mb-2 flex-row"
        >
          <TenantLogo tenant={tenant} />
          {tenant.brands_list}
        </li>
      ))}
    </ul>
  )
}
