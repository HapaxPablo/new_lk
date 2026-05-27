import { HttpClient1C } from '@/lib/http-client'
import { IGroupedTenantsResponse } from '@/types/tenants'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const limit = Number(searchParams.get('limit')) || 15
    const offset = Number(searchParams.get('offset')) || 0
    const search = searchParams.get('search') || undefined

    const paramsFor1C: Record<string, string> = {
      limit: String(limit),
      offset: String(offset),
    }

    if (search) {
      paramsFor1C.search = search
    }

    const queryString = new URLSearchParams(paramsFor1C).toString()

    const response = await HttpClient1C.server(
      request
    ).get<IGroupedTenantsResponse>(`api/tenants/grouped/?${queryString}`)

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in tenants/grouped API:', error)

    const status = error.message?.includes('Session expired')
      ? 401
      : error.message?.includes('Request failed')
        ? 502
        : 500

    return Response.json({ error: error.message }, { status })
  }
}
