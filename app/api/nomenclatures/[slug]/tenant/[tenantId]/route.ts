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
  console.log('COOKIE HEADER:', request.headers.get('cookie'))
  console.log('ALL COOKIES:', request.cookies.getAll())
  try {
    const { id, tenantId } = await params

    await HttpClient1C.server(request).delete(
      `api/nomenclatures/${id}/tenant/${tenantId}/`
    )

    return new Response(null, { status: 204 })
  } catch (error: any) {
    console.error('DELETE error:', error)

    if (error.message === 'Session expired') {
      return Response.json({ detail: 'Session expired' }, { status: 401 })
    }

    const status = error.response?.status || error.status || 500
    const data = error.response?.data || { message: error.message }
    return Response.json(data, { status })
  }
}
