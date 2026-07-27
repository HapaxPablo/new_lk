import { HttpClient1C } from '@/lib/http-client'
import { IPromotionResponse } from '@/types'
import { NextRequest } from 'next/server'

export const revalidate = 3600

export async function GET(request: NextRequest) {
  console.log('=== API Route Debug ===')
  console.log('URL:', request.url)
  console.log('Headers received:', {
    'x-access-token': request.headers.get('x-access-token')
      ? 'present'
      : 'missing',
    cookie: request.headers.get('cookie') ? 'present' : 'missing',
    authorization: request.headers.get('authorization') ? 'present' : 'missing',
  })

  try {
    const { searchParams } = new URL(request.url)

    const queryParams = {
      limit: Number(searchParams.get('limit')) || 24,
      page: Number(searchParams.get('page')) || 1,
      search: searchParams.get('search') || undefined,
    }

    const paramsFor1C: Record<string, string> = {
      limit: String(queryParams.limit),
      page: String(queryParams.page),
    }

    if (queryParams.search) {
      paramsFor1C.search = queryParams.search
    }

    const queryString = new URLSearchParams(paramsFor1C).toString()

    // Передаем request (NextRequest) в HttpClient1C.server
    const response = await HttpClient1C.server(request).get<IPromotionResponse>(
      `api/promotions/?${queryString}`
    )

    console.log('Response from 1C API received, count:', response.count)

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in promotions API:', error)

    const status = error.message.includes('Session expired')
      ? 401
      : error.message.includes('Request failed')
        ? 502
        : 500

    return Response.json({ error: error.message }, { status })
  }
}
