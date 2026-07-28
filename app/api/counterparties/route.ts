import { HttpClient1C } from '@/lib/http-client'
import { ICounterpartyResponse } from '@/types/counterparty'
import { NextRequest, NextResponse } from 'next/server'
import { withApiErrorHandling } from '@/lib/http-client/errors'

export const revalidate = 3600

async function handleGet(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

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

  const response = await HttpClient1C.server(request).get<ICounterpartyResponse>(
    `api/counterparties/?${queryString}`
  )

  return NextResponse.json(response)
}

export async function GET(request: NextRequest) {
  return withApiErrorHandling(() => handleGet(request))
}
