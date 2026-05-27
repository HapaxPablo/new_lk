import { HttpClient1C } from '@/lib/http-client'
import { ITenantDetailResponse } from '@/types/tenants'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

interface TenantDetailApiProps {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, props: TenantDetailApiProps) {
  try {
    const { id } = await props.params

    const response = await HttpClient1C.server(
      request
    ).get<ITenantDetailResponse>(`api/tenants/${id}/`)

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in tenant detail API:', error)

    const status = error.message?.includes('Session expired')
      ? 401
      : error.message?.includes('404')
        ? 404
        : error.message?.includes('Request failed')
          ? 502
          : 500

    return Response.json({ error: error.message }, { status })
  }
}
