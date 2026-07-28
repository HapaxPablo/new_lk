import { HttpClient1C } from '@/lib/http-client'
import { IGroupedTenantsResponse } from '@/types/tenants'
import { NextRequest } from 'next/server'
import { withApiErrorHandling } from '@/lib/http-client/errors'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  return withApiErrorHandling(async () => {
    const searchParams = request.nextUrl.searchParams

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

    const response = await HttpClient1C.server(request).get<
      IGroupedTenantsResponse
    >(`api/tenants/grouped/?${queryString}`)

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })
}
