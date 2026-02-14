import { HttpClient1C } from '@/lib/http-client'
import { ICounterpartyResponse } from '@/types/counterparty'
import { NextRequest } from 'next/server'

export const revalidate = 3600

export async function GET(request: NextRequest) {
  // console.log('Counterparties API called with URL:', request.url)

  try {
    const { searchParams } = new URL(request.url)

    const queryParams = {
      limit: Number(searchParams.get('limit')) || 24,
      page: Number(searchParams.get('page')) || 1,
      search: searchParams.get('search') || undefined,
    }

    // console.log('Query params received:', queryParams)

    const paramsFor1C: Record<string, string> = {
      limit: String(queryParams.limit),
      page: String(queryParams.page),
    }

    if (queryParams.search) {
      paramsFor1C.search = queryParams.search
    }

    const queryString = new URLSearchParams(paramsFor1C).toString()
    // console.log('Making request to 1C API with params:', paramsFor1C)

    // Делаем запрос к 1С через наш HttpClient
    const response = await HttpClient1C.server(
      request
    ).get<ICounterpartyResponse>(`api/counterparties/?${queryString}`)

    // console.log('Response from 1C API received, count:', response.count)

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in nomenclatures API:', error)
    return Response.json(
      { error: error.message },
      { status: error.status || 500 }
    )
  }
}
