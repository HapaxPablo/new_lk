'use client'

import { useEffect } from 'react'
import {
  type NomenclatureFilters,
  useNomenclatureFiltersStore,
} from '@/store/useNomenclatureFiltersStore'

interface NomenclatureFiltersInitializerProps {
  filters: NomenclatureFilters
  enabled: boolean
}

/** URL-фильтры имеют приоритет при прямом открытии страницы. */
export function NomenclatureFiltersInitializer({
  filters,
  enabled,
}: NomenclatureFiltersInitializerProps) {
  const replaceFilters = useNomenclatureFiltersStore(
    (state) => state.replaceFilters
  )

  useEffect(() => {
    if (enabled) replaceFilters(filters)
  }, [enabled, filters, replaceFilters])

  return null
}
