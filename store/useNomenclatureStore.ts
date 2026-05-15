'use client'
import { clearCookie, writeCookie } from '@/lib/constants'
import { INomenclatureBase } from '@/types/nomenclature'
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
  toggleAllItems: (items: any[]) => void
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
      toggleAllItems: (newItems: any[]) => {
        const { ids, items: currentItems } = get()
        const newItemIds = newItems.map((i) => i.id)

        // Проверяем, все ли новые элементы уже выбраны
        const allSelected =
          newItemIds.length > 0 && newItemIds.every((id) => ids.includes(id))

        if (allSelected) {
          // Если все выбраны - удаляем их
          const itemsToKeep = currentItems.filter(
            (i) => !newItemIds.includes(i.id)
          )
          writeCookie(itemsToKeep.map((i) => i.id))
          set({ items: itemsToKeep, ids: itemsToKeep.map((i) => i.id) })
        } else {
          // Если не все выбраны - добавляем их
          const map = new Map(currentItems.map((i) => [i.id, i]))
          newItems.forEach((i) => map.set(i.id, i))
          const items = Array.from(map.values())
          writeCookie(items.map((i) => i.id))
          set({ items, ids: items.map((i) => i.id) })
        }
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
