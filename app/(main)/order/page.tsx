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
    const baseUrl = new URL('api/nomenclatures/', process.env.API_1C_URL)

    const results = await Promise.all(
        ids.map((id) =>
            fetch(`${baseUrl}${id}`, { cache: 'no-store' })
                .then((res) => (res.ok ? res.json() : null))
                .catch(() => null)  // сетевая ошибка не роняет всю страницу
        )
    )

    return results.filter(Boolean) as INomenclatureItem[]
}

// ── page ─────────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
    const ids = await getSelectedIds()
    return generateOrderMetadata({ itemCount: ids.length })
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