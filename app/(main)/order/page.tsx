import { cookies } from 'next/headers'
import PlacementOrderCreatePage from './PlacementOrderCreatePage'
import { Metadata } from 'next'
import { generateOrderMetadata } from '@/lib/configs/config-meta/order/generateOrderMetadata'
import { STORAGE_KEY } from '@/lib/constants'
import { INomenclatureItem } from '@/types/nomenclature'

// ── helpers ──────────────────────────────────────────────────────────────────

function parseIds(raw: string | undefined): string[] {
    if (!raw) return []
    try {
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []
        return parsed
            .filter((id): id is string => typeof id === 'string')
            .filter((id) => id.length > 0 && !/[/\\?#]/.test(id))
            .slice(0, 100)  // защита от огромных корзин
    } catch {
        return []
    }
}

async function getSelectedIds(): Promise<string[]> {
    const cookieStore = await cookies()
    const raw = cookieStore.get(STORAGE_KEY)?.value
    return parseIds(raw)
}

async function getNomenclatures(ids: string[]): Promise<INomenclatureItem[]> {
    if (!ids.length) return []

    const baseUrl = new URL('api/nomenclatures/bulk/', process.env.API_1C_URL)
    baseUrl.searchParams.set('ids', ids.join(','))

    try {
        const res = await fetch(baseUrl.toString(), { cache: 'no-store' })
        if (!res.ok) return []
        const data = await res.json()
        return Array.isArray(data) ? data : []
    } catch {
        return []
    }
}

// ── page ─────────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
    const ids = await getSelectedIds()
    const metadata = generateOrderMetadata({ itemCount: ids.length })

    return {
        ...metadata,
        robots: {
            index: false,  // ← Исключить корзину из индексации
            follow: true,
        },
    }
}

export default async function Page() {
    const ids = await getSelectedIds()
    const items = ids.length ? await getNomenclatures(ids) : []

    return (
        <PlacementOrderCreatePage
            initialIds={ids}
            initialItems={items}
        />
    )
}