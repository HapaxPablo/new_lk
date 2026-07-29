'use client'

import { useState } from 'react'
import { SegmentedControl } from '@mantine/core'
import { Button } from '@/components/ui/button/Button'
import OrdersTable from './components/Orderstable'
import Link from 'next/link'

export default function Page() {
  const [type, setType] = useState<'ad' | 'bg'>('ad')

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1>Заказы</h1>
      <SegmentedControl
        value={type}
        onChange={(value) => setType(value as 'ad' | 'bg')}
        data={[
          { value: 'ad', label: 'Реклама' },
          { value: 'bg', label: 'Фон' },
        ]}
      />

      <OrdersTable type={type} />
    </div>
  )
}
