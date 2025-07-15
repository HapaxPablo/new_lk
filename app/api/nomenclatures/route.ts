import { HttpClient1C } from '@/lib/http-client'
import {
  INomenclatureQueryParams,
  INomenclatureResponse,
} from '@/types/nomenclature'
import { NextRequest } from 'next/server'

// TODO сделать кэширование ответа на 1 час
export const revalidate = 3600

export async function GET(request: NextRequest) {
  // console.log('Nomenclatures API:', request.url)
  // console.log('nomen request:', request)

  try {
    const { searchParams } = new URL(request.url)

    const queryParams: INomenclatureQueryParams = {
      limit: Number(searchParams.get('limit')) || 10,
      offset: Number(searchParams.get('offset')) || 0,
      search: searchParams.get('search') || undefined,
    }

    // Делаем запрос к 1С через наш HttpClient
    const response = await HttpClient1C.server(
      request
    ).get<INomenclatureResponse>(
      `getNomenclatureList?${new URLSearchParams({
        limit: String(queryParams.limit),
        offset: String(queryParams.offset),
        ...(queryParams.search && { search: queryParams.search }),
      })}`
    )

    return Response.json(response)
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: error.status || 500 }
    )
  }
}
