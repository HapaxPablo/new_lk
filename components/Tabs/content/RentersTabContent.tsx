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
    tenant.tenant.logotypes && tenant.tenant.logotypes.length > 0
  )

  // Если нет логотипа или была ошибка загрузки, не рендерим
  if (!shouldRender || hasError) {
    return null
  }

  return (
    <Image
      src={tenant.tenant.logotypes![0]}
      alt={`${tenant.tenant.brands_list} логотип`}
      width={50}
      height={50}
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
    <ul>
      {tenants.map((tenant, index) => (
        <li
          key={tenant.tenant.id || index}
          className="flex items-center mb-2 flex-row"
        >
          <TenantLogo tenant={tenant} />
          {tenant.tenant.brands_list}
        </li>
      ))}
    </ul>
  )
}
