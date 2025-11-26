import { HttpClient1C } from '@/lib/http-client'
import { ICounterpartyResponse } from '@/types/counterparty'
import { NextRequest } from 'next/server'

export const revalidate = 3600

export async function GET(request: NextRequest) {
  console.log('Counterparties API called with URL:', request.url)

  try {
    const { searchParams } = new URL(request.url)

    const queryParams = {
      limit: Number(searchParams.get('limit')) || 150,
      page: Number(searchParams.get('page')) || 1,
      name: searchParams.get('name') || undefined,
      is_deleted: 'false',
    }

    console.log('Query params for counterparties:', queryParams)

    const paramsFor1C: Record<string, string> = {
      limit: String(queryParams.limit),
      page: String(queryParams.page),
      is_deleted: queryParams.is_deleted,
    }

    if (queryParams.name) {
      paramsFor1C.name = queryParams.name
    }

    const queryString = new URLSearchParams(paramsFor1C).toString()
    console.log('Making request to 1C API for counterparties with params:', paramsFor1C)

    const response = await HttpClient1C.server(
      request
    ).get<ICounterpartyResponse>(`api/counterparties/?${queryString}`)

    console.log('Response from 1C API for counterparties received, count:', response.count)

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in counterparties API:', error)
    return Response.json(
      { error: error.message },
      { status: error.status || 500 }
    )
  }
}