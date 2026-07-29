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
      <Link href="/" className="text-sm text-blue-600!">
        На главную
      </Link>
      <h1>Заказы</h1>

      <div className="flex flex-wrap gap-4">
        <Button href="/orders/files">Файлы</Button>
        <Button href="/orders/playlists">Плейлисты</Button>
        <Button href="/orders/ad/create">Создать рекламный заказ</Button>
        <Button href="/orders/bg/create">Создать заказ фоновой музыки</Button>
      </div>

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
