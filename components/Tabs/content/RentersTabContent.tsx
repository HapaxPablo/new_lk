'use client'

import React from 'react'

interface Tenant {
  id: string
  name: string
  brands_list: string
}

interface RentersTabContentProps {
  tenants: Tenant[]
}

export const RentersTabContent = ({ tenants }: RentersTabContentProps) => {
  if (tenants.length === 0) {
    return <p>Арендаторы не найдены</p>
  }

  return (
    <ul>
      {tenants.map((tenant, index) => (
        <li key={tenant.id || index}>👥 {tenant.brands_list}</li>
      ))}
    </ul>
  )
}
