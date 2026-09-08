import { HttpClient1C } from '@/lib/http-client'
import { toNomenclatureListItem } from '@/lib/nomenclature/dto'
import { normalizeNomenclatureSearchBody } from '@/lib/nomenclature/searchBody'
import { INomenclatureItem } from '@/types/nomenclature'
import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'

/**
 * Отдаём только минимальный DTO списка (карточка + корзина),
 * а не сущности 1С целиком. Формируем next/previous по страницам.
 */
function toSlimResponse(response: {
  count: number
  page: number
  limit: number
  next_page: number | null
  previous_page: number | null
  results: INomenclatureItem[]
}) {
  return {
    count: response.count,
    page: response.page,
    limit: response.limit,
    results: Array.isArray(response.results)
      ? response.results.map(toNomenclatureListItem)
      : [],
    next: response.next_page === null ? null : String(response.next_page),
    previous:
      response.previous_page === null ? null : String(response.previous_page),
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = normalizeNomenclatureSearchBody(await request.json(), {
      pagination: true,
    })

    if (!body) {
      return Response.json({ error: 'Некорректный запрос' }, { status: 400 })
    }
    const response = await HttpClient1C.server(request).postReadOnly<{
      count: number
      page: number
      limit: number
      next_page: number | null
      previous_page: number | null
      results: INomenclatureItem[]
    }>('api/nomenclatures/web/search/', body)

    return Response.json(toSlimResponse(response))
  } catch (error: unknown) {
    const status = (error as { status?: number })?.status || 500
    // Не логируем тело: в error.message лежит полный ответ 1С
    console.error('[api/nomenclatures] upstream error', {
      status,
    })
    return Response.json({ error: 'Ошибка загрузки каталога' }, { status })
  }
}
