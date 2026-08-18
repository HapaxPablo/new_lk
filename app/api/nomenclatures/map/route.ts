import { HttpClient1C } from '@/lib/http-client'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await HttpClient1C.server(request).post(
      'api/nomenclatures/web/map/',
      body
    )
    return Response.json(response)
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: error.status || 500 }
    )
  }
}
