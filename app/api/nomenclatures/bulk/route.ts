import { HttpClient1C } from '@/lib/http-client'
import { INomenclatureItem } from '@/types/nomenclature'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids')

    if (!ids) {
      return Response.json(
        { error: 'Параметр ids обязателен' },
        { status: 400 }
      )
    }

    const idList = ids.split(',').filter(Boolean)

    if (!idList.length) {
      return Response.json([], { status: 200 })
    }

    const results = await Promise.all(
      idList.map((id) =>
        HttpClient1C.server(request)
          .get<INomenclatureItem>(`api/nomenclatures/${id}`)
          .catch(() => null)
      )
    )

    const items = results.filter(Boolean) as INomenclatureItem[]

    console.log('items', items)

    return Response.json(items)
  } catch (error: any) {
    console.error('Error in nomenclatures bulk API:', error)
    return Response.json(
      { error: error.message },
      { status: error.status || 500 }
    )
  }
}
