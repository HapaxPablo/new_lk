import { HttpClient1C } from '@/lib/http-client'
import { INomenclatureDetailsItem } from '@/types/nomenclature'
import { NextRequest } from 'next/server'

export const revalidate = 3600 

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('Nomenclature detail API called for ID:', id)

    if (!id) {
      return Response.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const response = await HttpClient1C.server(
      request
    ).get<INomenclatureDetailsItem>(`api/nomenclatures/${id}`)

    console.log('Successfully fetched nomenclature details for ID:', id)

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in nomenclature detail API:', error)
    
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

    return Response.json(
      { error: message },
      { status }
    )
  }
}