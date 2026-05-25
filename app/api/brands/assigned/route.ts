import { HttpClient1C } from '@/lib/http-client'
import { IBrandListResponse } from '@/types/brands'
import { NextRequest } from 'next/server'

export const revalidate = 3600

export async function GET(request: NextRequest) {
  console.log('=== API Route Debug ===')
  console.log('URL:', request.url)
  console.log('Cookies:', request.cookies.getAll())

  try {
    const { searchParams } = new URL(request.url)

    const queryParams = {
      limit: Number(searchParams.get('limit')) || 15,
      offset: Number(searchParams.get('offset')) || 0,
      search: searchParams.get('search') || '',
    }

    const paramsFor1C: Record<string, string> = {
      limit: String(queryParams.limit),
      offset: String(queryParams.offset),
      search: String(queryParams.search),
    }
    const queryString = new URLSearchParams(paramsFor1C).toString()

    // Используем HttpClient1C.server с request
    const response = await HttpClient1C.server(request).get<IBrandListResponse>(
      `api/brands/assigned?${queryString}`
    )

    console.log('Response from 1C API received, count:', response.count)

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in brands/assigned API:', error)

    const status = error.message.includes('Session expired')
      ? 401
      : error.message.includes('Request failed')
        ? 502
        : 500

    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.toString(),
      }),
      {
        status,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
