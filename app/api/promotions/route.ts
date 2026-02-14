import { HttpClient1C } from '@/lib/http-client'
import { IPromotionResponse } from '@/types/promotion'
import { NextRequest } from 'next/server'

export const revalidate = 3600

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

    const response = await HttpClient1C.server(request).get<IPromotionResponse>(
      `api/promotions/?${queryString}`
    )

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in promotions API:', error)
    return Response.json(
      { error: error.message },
      { status: error.status || 500 }
    )
  }
}
