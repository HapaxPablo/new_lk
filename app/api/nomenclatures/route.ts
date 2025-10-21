import { HttpClient1C } from '@/lib/http-client'
import {
  INomenclatureQueryParams,
  INomenclatureResponse,
} from '@/types/nomenclature'
import { NextRequest } from 'next/server'

export const revalidate = 3600

export async function GET(request: NextRequest) {
  console.log('Nomenclatures API called with URL:', request.url)

  try {
    const { searchParams } = new URL(request.url)

    const queryParams: INomenclatureQueryParams = {
      limit: Number(searchParams.get('limit')) || 24,
      page: Number(searchParams.get('page')) || 1,
      name: searchParams.get('name') || undefined,
      brand_name: searchParams.get('brand_name') || undefined,
    }

    console.log('Query params received:', queryParams)

    // Формируем параметры для 1С API
    const paramsFor1C: Record<string, string> = {
      limit: String(queryParams.limit),
      page: String(queryParams.page),
    }

    // Добавляем параметры фильтрации если они есть
    if (queryParams.name) {
      paramsFor1C.name = queryParams.name
    }
    if (queryParams.brand_name) {
      paramsFor1C.brand_name = queryParams.brand_name
    }

    const queryString = new URLSearchParams(paramsFor1C).toString()
    console.log('Making request to 1C API with params:', paramsFor1C)

    // Делаем запрос к 1С через наш HttpClient
    const response = await HttpClient1C.server(
      request
    ).get<INomenclatureResponse>(`api/nomenclatures/?${queryString}`)

    console.log('Response from 1C API received, count:', response.count)
    console.log('First item brand:', response.results[0]?.brand)

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in nomenclatures API:', error)
    return Response.json(
      { error: error.message },
      { status: error.status || 500 }
    )
  }
}
