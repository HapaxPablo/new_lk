'use client'

import { useEffect, useRef } from 'react'
import { useNomenclatureStore } from '@/store/useNomenclatureStore'
import { STORAGE_KEY } from '@/lib/constants'
import { INomenclatureItem } from '@/types/nomenclature'

export function NomenclatureStoreProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const initialized = useRef(false)
    const setInitial = useNomenclatureStore((state) => state.setInitial)
    const ids = useNomenclatureStore((state) => state.ids)

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true

        if (ids.length > 0) return

        const match = document.cookie
            .split('; ')
            .find((c) => c.startsWith(`${STORAGE_KEY}=`))

        if (!match) return

        let cookieIds: string[] = []
        try {
            cookieIds = JSON.parse(match.split('=')[1])
        } catch {
            return
        }

        if (!cookieIds.length) return

        fetch(`/api/nomenclatures/bulk/?ids=${cookieIds.join(',')}`)
            .then(async (r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`)
                const data = await r.json()
                if (!Array.isArray(data)) throw new Error('Not an array')
                return data
            })
            .then((items: INomenclatureItem[]) => {
                console.log('[Store] fetched items:', items)
                setInitial(cookieIds, items)
            })
            .catch((e) => {
                console.error('[Store] fetch error:', e)
                // хотя бы счётчик в хедере будет верный
                setInitial(cookieIds, [])
            })
    }, [])

    return <>{children}</>
}