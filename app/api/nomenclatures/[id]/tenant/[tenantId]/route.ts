import { HttpClient1C } from '@/lib/http-client'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tenantId: string }> }
) {
  try {
    const { id, tenantId } = await params

    const response = await HttpClient1C.server(request).get(
      `api/nomenclatures/${id}/tenant/${tenantId}/`
    )

    return Response.json(response)
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tenantId: string }> }
) {
  try {
    const { id, tenantId } = await params
    const body = await request.json()

    const response = await HttpClient1C.server(request).patch(
      `api/nomenclatures/${id}/tenant/${tenantId}/`,
      body
    )

    return Response.json(response)
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tenantId: string }> }
) {
  try {
    const { id, tenantId } = await params

    const response = await HttpClient1C.server(request).delete(
      `api/nomenclatures/${id}/tenant/${tenantId}/`
    )

    return Response.json(response)
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    )
  }
}
