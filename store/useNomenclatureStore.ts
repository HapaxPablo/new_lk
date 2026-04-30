'use client'
import { clearCookie, STORAGE_KEY, writeCookie } from '@/lib/constants'
import { INomenclatureBase, INomenclatureItem } from '@/types/nomenclature'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Item extends INomenclatureBase {
  id: string
  [key: string]: any
  pricePerMonth: string
}

interface State {
  ids: string[]
  items: Item[]
  setInitial: (ids: string[], items: Item[]) => void
  toggle: (item: INomenclatureBase) => void
  mergeItems: (items: Item[]) => void
  removeItem: (id: string) => void
  getTotalPrice: () => number
}
export const useNomenclatureStore = create<State>()(
  persist(
    (set, get) => ({
      ids: [],
      items: [],

      toggle: (item) => {
        const { items } = get()
        const exists = items.some((i) => i.id === item.id)
        const updated = exists
          ? items.filter((i) => i.id !== item.id)
          : [...items, item]

        writeCookie(updated.map((i) => i.id)) // ← было и раньше

        set({ items: updated, ids: updated.map((i) => i.id) })
      },

      removeItem: (id) => {
        set((state) => {
          const items = state.items.filter((i) => i.id !== id)
          const ids = state.ids.filter((i) => i !== id)
          writeCookie(ids) // ← добавить
          return { items, ids }
        })
      },

      setInitial: (ids, items) => {
        const safeItems = Array.isArray(items) ? items : []
        const safeIds = Array.isArray(ids) ? ids : []
        if (safeIds.length === 0) {
          clearCookie()
        } else {
          writeCookie(safeIds)
        }
        set({ ids: safeIds, items: safeItems })
      },

      mergeItems: (newItems) => {
        const current = get().items
        const map = new Map(current.map((i) => [i.id, i]))
        newItems.forEach((i) => map.set(i.id, i))
        const items = Array.from(map.values())
        writeCookie(items.map((i) => i.id)) // ← добавить
        set({ items, ids: items.map((i) => i.id) })
      },

      getTotalPrice: () => {
        const items = get().items
        if (!Array.isArray(items)) return 0
        return items.reduce((sum, item) => {
          const price = parseFloat(item.pricePerMonth || '0')
          return sum + (Number.isFinite(price) ? price : 0)
        }, 0)
      },
    }),

    {
      name: 'nomenclature-storage',
      partialize: (state) => ({
        ids: state.ids,
        items: state.items,
      }),
      merge: (persisted: any, current) => ({
        ...current,
        ids: Array.isArray(persisted?.ids) ? persisted.ids : [],
        items: Array.isArray(persisted?.items) ? persisted.items : [],
      }),
    }
  )
)
