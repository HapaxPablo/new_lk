import { HttpClient1C } from '@/lib/http-client'
import {
  INomenclatureQueryParams,
  INomenclatureResponse,
} from '@/types/nomenclature'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const limit = Number(searchParams.get('limit')) || 24
    const page = Number(searchParams.get('page')) || 1
    const body: Record<string, string | number | boolean | string[]> = {
      limit,
      page,
    }

    const copyString = (key: string) => {
      const value = searchParams.get(key)
      if (value) body[key] = value
    }

    const stringFilterKeys = [
      'search',
      'brand_name',
      'status',
      'type_of_place',
      'city_slug',
      'price_from',
      'price_to',
    ]
    stringFilterKeys.forEach(copyString)

    const brandIds = (searchParams.get('brand_id') || '')
      .split(',')
      .filter(Boolean)
    if (brandIds.length > 1) body.brand_ids = brandIds
    else if (brandIds.length === 1) body.brand_id = brandIds[0]

    const counterpartyIds = (searchParams.get('counterparty_id') || '')
      .split(',')
      .filter(Boolean)
    if (counterpartyIds.length > 1) body.counterparty_ids = counterpartyIds
    else if (counterpartyIds.length === 1) body.counterparty_id = counterpartyIds[0]

    const contentTypes = (searchParams.get('content_types') || '')
      .split(',')
      .filter(Boolean)
    if (contentTypes.length) body.content_types = contentTypes

    const hasFacade = searchParams.get('has_facade')
    if (hasFacade === 'true' || hasFacade === 'false') {
      body.has_facade = hasFacade === 'true'
    }

    const response = await HttpClient1C.server(request).post<{
      count: number
      page: number
      limit: number
      next_page: number | null
      previous_page: number | null
      results: INomenclatureResponse['results']
    }>('api/nomenclatures/web/search/', body)

    return Response.json({
      ...response,
      next: response.next_page === null ? null : String(response.next_page),
      previous:
        response.previous_page === null ? null : String(response.previous_page),
    })
  } catch (error: any) {
    console.error('Error in nomenclatures API:', error)
    return Response.json(
      { error: error.message },
      { status: error.status || 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await HttpClient1C.server(request).post<{
      count: number
      page: number
      limit: number
      next_page: number | null
      previous_page: number | null
      results: INomenclatureResponse['results']
    }>('api/nomenclatures/web/search/', body)

    return Response.json({
      ...response,
      next: response.next_page === null ? null : String(response.next_page),
      previous:
        response.previous_page === null ? null : String(response.previous_page),
    })
  } catch (error: any) {
    console.error('Error in nomenclatures search API:', error)
    return Response.json(
      { error: error.message },
      { status: error.status || 500 }
    )
  }
}
