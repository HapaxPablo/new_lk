import { HttpClient1C } from '@/lib/http-client'
import { NextRequest } from 'next/server'
export const revalidate = 0
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('❗ [id] route called with id:', id)
    const searchParams = request.nextUrl.searchParams.toString()
    const query = searchParams ? `?${searchParams}` : ''

    const response = await HttpClient1C.server(request).get(
      `api/nomenclatures/${id}/tenant/${query}`
    )

    if (!response.ok) {
      return Response.json(
        { error: response.message },
        { status: response.status }
      )
    }

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in [id] tenant API:', error)
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const response = await HttpClient1C.server(request).post(
      `api/nomenclatures/${id}/tenant/`,
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
