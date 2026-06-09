import { HttpClient1C } from '@/lib/http-client'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const response = await HttpClient1C.server(request).get(
      `api/nomenclatures/${id}/tenant/floors/`
    )

    return Response.json(response)
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    )
  }
}
