// app/placement-order/page.tsx

import { cookies } from 'next/headers'
import PlacementOrderCreatePage from './PlacementOrderCreatePage'
import { Metadata } from 'next'
import { generateOrderMetadata } from '@/lib/configs/config-meta/order/generateOrderMetadata'

const STORAGE_KEY = 'selected_nomenclatures'

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies()
    const raw = cookieStore.get(STORAGE_KEY)?.value

    const ids: string[] = raw ? JSON.parse(raw) : []

    return generateOrderMetadata({ itemCount: ids.length })
}

async function getNomenclatures(ids: string[]) {
    const baseUrl = new URL('api/nomenclatures/', process.env.API_1C_URL)

    const requests = ids.map((id) =>
        fetch(`${baseUrl}${id}`, { cache: 'no-store' })
            .then((res) => (res.ok ? res.json() : null))
    )

    const results = await Promise.all(requests)
    return results.filter(Boolean)
}

export default async function Page() {
    const cookieStore = await cookies()
    const raw = cookieStore.get(STORAGE_KEY)?.value

    const ids: string[] = raw ? JSON.parse(raw) : []
    const items = ids.length ? await getNomenclatures(ids) : []

    return (
        <PlacementOrderCreatePage
            initialIds={ids}
            initialItems={items}
        />
    )
}