'use client'
import { INomenclatureItem } from '@/types/nomenclature'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Item extends INomenclatureItem {
  id: string
  [key: string]: any
  pricePerMonth: string
}

interface State {
  ids: string[]
  items: Item[]
  setInitial: (ids: string[], items: Item[]) => void
  toggle: (item: INomenclatureItem) => void
  mergeItems: (items: Item[]) => void
  removeItem: (id: string) => void
  getTotalPrice: () => number
}
const STORAGE_KEY = 'selected_nomenclatures'
export const useNomenclatureStore = create<State>()(
  persist(
    (set, get) => ({
      ids: [],
      items: [],

      toggle: (item: INomenclatureItem) => {
        const { items } = get()

        const exists = items.some((i) => i.id === item.id)

        const updated = exists
          ? items.filter((i) => i.id !== item.id)
          : [...items, item]

        document.cookie = `${STORAGE_KEY}=${JSON.stringify(updated.map((i) => i.id))}; path=/`

        set({
          items: updated,
          ids: updated.map((i) => i.id),
        })
      },

      getTotalPrice: () => {
        const { items } = get()

        return items.reduce((sum, item) => {
          const price = parseFloat(item.pricePerMonth || '0')
          return sum + (Number.isFinite(price) ? price : 0)
        }, 0)
      },
      setInitial: (ids, items) => {
        set({ ids, items })
      },

      mergeItems: (newItems) => {
        const current = get().items

        const map = new Map(current.map((i) => [i.id, i]))

        newItems.forEach((i) => map.set(i.id, i))

        set({ items: Array.from(map.values()) })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
          ids: state.ids.filter((i) => i !== id),
        }))
      },
    }),

    {
      name: 'nomenclature-storage',
    }
  )
)
