import { HttpClient1C } from '@/lib/http-client'
import { ICounterpartyDetails } from '@/types/counterparty'
import { NextRequest } from 'next/server'

export const revalidate = 3600

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // console.log('=== Counterparty Details API Route Debug ===')
  // console.log('URL:', request.url)
  // console.log('Method:', request.method)
  // console.log('Cookies:', request.cookies.getAll())
  // console.log('Headers:', {
  //   authorization: request.headers.get('authorization'),
  //   'x-access-token': request.headers.get('x-access-token'),
  //   cookie: request.headers.get('cookie'),
  //   'user-agent': request.headers.get('user-agent'),
  // })

  try {
    const { id } = await params
    // console.log('CounterpartyDetails API called for ID:', id)

    if (!id) {
      // console.log('ID is missing')
      return Response.json({ error: 'ID is required' }, { status: 400 })
    }

    // Проверяем наличие токена
    const token =
      request.cookies.get('access_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '')

    // console.log('Token present:', !!token)
    // if (token) {
    // console.log('Token (first 20 chars):', token.substring(0, 20))
    // }

    // Делаем запрос к 1С через наш HttpClient
    // console.log(`Making request to 1C API: api/counterparties/${id}`)
    const response = await HttpClient1C.server(
      request
    ).get<ICounterpartyDetails>(`api/counterparties/${id}`)

    // console.log('Successfully fetched CounterpartyDetails details for ID:', id)
    // console.log('Response data:', JSON.stringify(response).substring(0, 200))

    return Response.json(response)
  } catch (error: any) {
    console.error('=== Error in CounterpartyDetails detail API ===')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)

    if (error.cause) {
      console.error('Error cause:', error.cause)
    }

    let status = 500
    let message = error.message || 'Internal server error'

    if (
      error.message.includes('Session expired') ||
      error.message.includes('401')
    ) {
      status = 401
      message = 'Ошибка авторизации'
      console.error('Authentication error - token might be expired or invalid')
    } else if (error.message.includes('404')) {
      status = 404
      message = 'CounterpartyDetails не найдена'
    } else if (error.message.includes('Failed to fetch')) {
      status = 503
      message = 'Сервис временно недоступен'
    }

    return Response.json({ error: message, details: error.message }, { status })
  }
}
