export const TENANT_CATEGORIES = [
  'Детские товары',
  'Электроника',
  'Банки и финансы',
  'Одежда и обувь',
  'Косметика',
] as const

export const TENANT_CITIES = [
  'Красноярск',
  'Ачинск',
  'Лесосибирск',
  'Абакан',
] as const

export const TENANT_SORTS = [
  { value: 'count_desc', label: 'По количеству площадок' },
  { value: 'name_asc', label: 'По алфавиту' },
  { value: 'popular', label: 'По популярности' },
] as const

export const TENANT_QUICK_CATEGORIES = [
  { value: '', label: 'Все арендаторы' },
  { value: 'Детские товары', label: 'Детские товары' },
  { value: 'Электроника', label: 'Электроника' },
  { value: 'Банки и финансы', label: 'Банки' },
  { value: 'Одежда и обувь', label: 'Одежда' },
] as const

export const setTenantFilterParams = (
  current: URLSearchParams,
  values: Record<string, string | undefined>
) => {
  const params = new URLSearchParams(current.toString())

  Object.entries(values).forEach(([key, value]) => {
    if (value) params.set(key, value)
    else params.delete(key)
  })

  params.delete('offset')
  return params
}
