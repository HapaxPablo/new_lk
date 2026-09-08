import { HttpClient1C } from '@/lib/http-client'
import { IPromotionResponse } from '@/types'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
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

    return Response.json(response)
  } catch (error: any) {
    console.error('[api/promotions] upstream error', {
      status: error.status || 500,
    })

    const status = error.message.includes('Session expired')
      ? 401
      : error.message.includes('Request failed')
        ? 502
        : 500

    return Response.json({ error: error.message }, { status })
  }
}
