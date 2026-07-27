import { Button } from '@/components/ui/button/Button'
import Link from 'next/link'
import { ModalAddAdOrder } from './components/ModalAddAdOrder'

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h1>Заказы</h1>
      </div>
      <div className="flex flex-row flex-wrap gap-4">
        <Button href="/orders/files">Файлы</Button>
        <Button href="/orders/playlists">Плейлисты</Button>
        <ModalAddAdOrder />
      </div>
    </div>
  )
}
