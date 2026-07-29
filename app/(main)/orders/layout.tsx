import { Button } from '@/components/ui/button/Button'
import Link from 'next/link'

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-2 p-3 overflow-y-auto">
      <Link href="/" className="text-sm text-blue-600!">
        На главную
      </Link>
      <div className="flex flex-wrap gap-4">
        <Button href="/orders/files" target="_blank">
          Файлы
        </Button>
        <Button href="/orders/playlists" target="_blank">
          Плейлисты
        </Button>
        <Button href="/orders/ad/create" target="_blank">
          Создать рекламный заказ
        </Button>
        <Button href="/orders/bg/create" target="_blank">
          Создать заказ фоновой музыки
        </Button>
      </div>
      {children}
    </section>
  )
}
