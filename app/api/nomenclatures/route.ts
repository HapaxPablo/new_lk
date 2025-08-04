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
      page: Number(searchParams.get('page')) || 1,
      searchValue: searchParams.get('searchValue') || undefined,
    }

    // Делаем запрос к 1С через наш HttpClient
    const response = await HttpClient1C.server(
      request
    ).get<INomenclatureResponse>(
      `api/nomenclatures/?${new URLSearchParams({
        limit: String(queryParams.limit),
        page: String(queryParams.page),
        ...(queryParams.searchValue && { searchValue: queryParams.searchValue }),
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
