import { HttpClient1C } from '@/lib/http-client'
import { toNomenclatureMapPoint } from '@/lib/nomenclature/dto'
import { normalizeNomenclatureSearchBody } from '@/lib/nomenclature/searchBody'
import { INomenclatureMapItem } from '@/types/nomenclature'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = normalizeNomenclatureSearchBody(await request.json())
    if (!body) {
      return Response.json({ error: 'Некорректный запрос' }, { status: 400 })
    }

    const response = await HttpClient1C.server(request).postReadOnly<{
      count: number
      results: INomenclatureMapItem[]
    }>('api/nomenclatures/web/map/', body)

    // Отдаём только точки для маркеров: id, координаты, заголовок, slug.
    const results = Array.isArray(response.results)
      ? response.results.map(toNomenclatureMapPoint)
      : []

    return Response.json({
      count: response.count ?? results.length,
      results,
    })
  } catch (error: unknown) {
    const status = (error as { status?: number })?.status || 500
    console.error('[api/nomenclatures/map] upstream error', { status })

    return Response.json({ error: 'Ошибка загрузки карты' }, { status })
  }
}
