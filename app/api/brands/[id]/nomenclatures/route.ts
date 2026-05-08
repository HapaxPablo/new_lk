import { HttpClient1C } from '@/lib/http-client'
import { IBrandDetail } from '@/types/brands'
import { NextRequest } from 'next/server'

export const revalidate = 3600

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; limit: string; offset: string }> }
) {
  try {
    const { id, limit, offset } = await params

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 })
    }

    const response = await HttpClient1C.server(request).get<IBrandDetail>(
      `api/brands/${id}/nomenclatures?limit=${limit || 15}&offset=${offset || 0}`
    )

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in brand detail API:', error)

    let status = 500
    let message = error.message || 'Internal server error'

    if (error.status === 404) {
      status = 404
      message = 'Бренд не найден'
    } else if (error.status === 401) {
      status = 401
      message = 'Ошибка авторизации'
    }

    return Response.json({ error: message }, { status })
  }
}
