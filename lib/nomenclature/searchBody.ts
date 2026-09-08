const MAX_LIST_LIMIT = 24
const MAX_FILTER_VALUES = 100

const STRING_FILTERS = [
  'search',
  'brand_name',
  'brand_id',
  'counterparty_id',
  'status',
  'type_of_place',
  'city_slug',
  'price_from',
  'price_to',
] as const

const ARRAY_FILTERS = [
  'brand_ids',
  'counterparty_ids',
  'content_types',
] as const

function positiveInteger(value: unknown, fallback: number, max?: number) {
  const number = Number(value)
  if (!Number.isInteger(number) || number < 1) return fallback
  return max ? Math.min(number, max) : number
}

export function normalizeNomenclatureSearchBody(
  input: unknown,
  options: { pagination?: boolean } = {}
) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null

  const source = input as Record<string, unknown>
  const body: Record<string, string | number | boolean | string[]> = {}

  if (options.pagination) {
    body.limit = positiveInteger(source.limit, MAX_LIST_LIMIT, MAX_LIST_LIMIT)
    body.page = positiveInteger(source.page, 1)
  }

  for (const key of STRING_FILTERS) {
    const value = source[key]
    if (typeof value === 'string' && value) body[key] = value
  }

  for (const key of ARRAY_FILTERS) {
    const value = source[key]
    if (Array.isArray(value)) {
      body[key] = value
        .filter((item): item is string => typeof item === 'string' && !!item)
        .slice(0, MAX_FILTER_VALUES)
    }
  }

  if (typeof source.has_facade === 'boolean') {
    body.has_facade = source.has_facade
  }

  return body
}
