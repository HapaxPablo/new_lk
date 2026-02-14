import { HttpClient1C } from '@/lib/http-client'
import { ICounterpartyDetails } from '@/types/counterparty'

import { NextRequest } from 'next/server'

export const revalidate = 3600

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // console.log('CounterpartyDetails API called for ID:', id)

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 })
    }

    const response = await HttpClient1C.server(
      request
    ).get<ICounterpartyDetails>(`api/counterparties/${id}`)

    // console.log('Successfully fetched CounterpartyDetails details for ID:', id)

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in CounterpartyDetails detail API:', error)


    let status = 500
    let message = error.message || 'Internal server error'

    if (error.status === 404) {
      status = 404
      message = 'CounterpartyDetails не найдена'
    } else if (error.status === 401) {
      status = 401
      message = 'Ошибка авторизации'
    }

    return Response.json({ error: message }, { status })
  }
}
