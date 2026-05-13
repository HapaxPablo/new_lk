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
    const search = searchParams.get('search') || undefined
    const brand_name = searchParams.get('brand_name') || undefined
    const brand_id = searchParams.get('brand_id') || undefined
    const status = searchParams.get('status') || undefined
    const type_of_place = searchParams.get('type_of_place') || undefined

    const paramsFor1C: Record<string, string> = {
      limit: String(limit),
      page: String(page),
    }

    if (search) paramsFor1C.search = search
    if (brand_name) paramsFor1C.brand_name = brand_name
    if (brand_id) paramsFor1C.brand_id = brand_id
    if (status) paramsFor1C.status = status
    if (type_of_place) paramsFor1C.type_of_place = type_of_place

    const queryString = new URLSearchParams(paramsFor1C).toString()

    const response = await HttpClient1C.server(
      request
    ).get<INomenclatureResponse>(`api/nomenclatures/?${queryString}`)

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in nomenclatures API:', error)
    return Response.json(
      { error: error.message },
      { status: error.status || 500 }
    )
  }
}
