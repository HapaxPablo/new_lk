import { HttpClient1C } from '@/lib/http-client'
import { IBrandListResponse } from '@/types/brands'
import { NextRequest, NextResponse } from 'next/server'
import { withApiErrorHandling } from '@/lib/http-client/errors'

export const revalidate = 3600

async function handleGet(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

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

  const response = await HttpClient1C.server(request).get<IBrandListResponse>(
    `api/brands/assigned?${queryString}`
  )

  return NextResponse.json(response)
}

export async function GET(request: NextRequest) {
  return withApiErrorHandling(() => handleGet(request))
}
