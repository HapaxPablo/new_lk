import { HttpClient1C } from '@/lib/http-client'
import { INomenclatureDetailsItem } from '@/types/nomenclature'
import { NextRequest } from 'next/server'

export const revalidate = 3600
type ApiResult<T> =
  | T
  | {
      error: true
      status: number
      message: string
    }
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    // console.log('Nomenclature detail API called for slug:', slug)

    if (!slug) {
      return Response.json({ error: 'Slug is required' }, { status: 400 })
    }

    const response = await HttpClient1C.server(request).get<
      ApiResult<INomenclatureDetailsItem>
    >(`api/nomenclatures/web/${slug}`)

    // console.log('Route response:', JSON.stringify(response))
    // console.log('Route response.ok:', (response as any).ok)
    // console.log('Route response.status:', (response as any).status)

    if (!(response as any).ok) {
      const errorStatus = (response as any).status || 404
      // console.log('Returning error response with status:', errorStatus)
      return Response.json(
        { error: (response as any).message },
        { status: errorStatus }
      )
    }

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in nomenclature detail API:', error)
    // console.log('STATUS:', error.status)
    // console.log('MESSAGE:', error.message)
    // Более детальная обработка ошибок
    let status = 500
    let message = error.message || 'Internal server error'

    if (error.status === 404) {
      status = 404
      message = 'Номенклатура не найдена'
    } else if (error.status === 401) {
      status = 401
      message = 'Ошибка авторизации'
    }

    return Response.json({ error: message }, { status })
  }
}
