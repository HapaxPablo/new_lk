import { HttpClient1C } from '@/lib/http-client'
import { withApiErrorHandling } from '@/lib/http-client/errors'
import { NextRequest, NextResponse } from 'next/server'

async function handleGet(request: NextRequest) {
  const queryString = request.nextUrl.searchParams.toString()
  const endpoint = `api/counterparties/filter-options/${
    queryString ? `?${queryString}` : ''
  }`
  const response = await HttpClient1C.server(request).get(endpoint)
  return NextResponse.json(response)
}

export async function GET(request: NextRequest) {
  return withApiErrorHandling(() => handleGet(request))
}
