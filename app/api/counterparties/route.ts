import { HttpClient1C } from '@/lib/http-client'
import { ICounterpartyResponse } from '@/types/counterparty'
import { NextRequest } from 'next/server'

export const revalidate = 3600

export async function GET(request: NextRequest) {
  // DEBUG: Check ALL incoming headers
  const allHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    allHeaders[key] = value
  })
  console.log(
    '[Counterparties API] ALL headers:',
    JSON.stringify(allHeaders, null, 2)
  )

  // Check cookies
  const cookies: Record<string, string> = {}
  request.cookies.getAll().forEach((cookie) => {
    cookies[cookie.name] = cookie.value
  })
  console.log(
    '[Counterparties API] ALL cookies:',
    JSON.stringify(cookies, null, 2)
  )

  // Check for token in different places
  const xAccessToken = request.headers.get('x-access-token')
  const authHeader = request.headers.get('Authorization')
  const cookieToken = request.cookies.get('access_token')?.value

  console.log('[Counterparties API] Token check:')
  console.log(
    '  - x-access-token header:',
    xAccessToken ? 'PRESENT' : 'MISSING'
  )
  console.log('  - Authorization header:', authHeader ? 'PRESENT' : 'MISSING')
  console.log('  - access_token cookie:', cookieToken ? 'PRESENT' : 'MISSING')

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
