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

    if (!id) {
      return Response.json({ error: 'id обязателен' }, { status: 400 })
    }

    const response = await HttpClient1C.server(request).get(
      `api/videos/${id}/get_nomenclature_videos/`
    )

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in nomenclature videos API:', error)
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    )
  }
}
