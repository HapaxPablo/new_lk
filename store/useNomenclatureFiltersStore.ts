'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface NomenclatureFilters {
  search?: string
  brand_name?: string
  brand_id?: string
  counterparty_id?: string
  status?: string
  type_of_place?: string
  city_slug?: string
  content_types?: string
  price_from?: string
  price_to?: string
  has_facade?: 'true' | 'false'
}

interface NomenclatureFiltersState {
  filters: NomenclatureFilters
  hasHydrated: boolean
  setFilter: <K extends keyof NomenclatureFilters>(
    key: K,
    value: NomenclatureFilters[K]
  ) => void
  resetFilters: () => void
  replaceFilters: (filters: NomenclatureFilters) => void
  setHasHydrated: (hasHydrated: boolean) => void
}

export const useNomenclatureFiltersStore = create<NomenclatureFiltersState>()(
  persist(
    (set) => ({
      filters: {},
      hasHydrated: false,
      setFilter: (key, value) =>
        set((state) => {
          const filters = { ...state.filters }
          if (value) {
            filters[key] = value
          } else {
            delete filters[key]
          }
          return { filters }
        }),
      resetFilters: () => set({ filters: {} }),
      replaceFilters: (filters) => set({ filters }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'nomenclature-filters',
      partialize: (state) => ({ filters: state.filters }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
)
