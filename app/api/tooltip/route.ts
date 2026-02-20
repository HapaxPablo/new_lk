import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { httpClient1CServer } from '@/lib/http-client/httpServer'

/**
 * API-прокси для тултипов.
 * Выполняет запрос к 1С API от имени сервера с автоматической авторизацией.
 * Использует тот же подход что и страницы (app/(main)/counterparties/[id]/page.tsx)
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  // endpoint приходит как параметр, например: /api/brands/123 или api/brands/123/
  const endpoint = searchParams.get('endpoint')

  if (!endpoint) {
    return Response.json({ error: 'Endpoint is required' }, { status: 400 })
  }

  try {
    const cookieHeader = request.headers.get('cookie') || ''

    // Убираем начальный слеш если есть
    const cleanEndpoint = endpoint.startsWith('/')
      ? endpoint.slice(1)
      : endpoint

    console.log('Tooltip API: fetching from', cleanEndpoint)

    // Создаем mock RequestCookies для совместимости с httpClient1CServer
    // Но передаем также и raw cookie header
    const cookieStore = await cookies()

    // Используем серверный клиент с cookies
    const response = await httpClient1CServer.get(
      cookieStore,
      cleanEndpoint,
      cookieHeader
    )

    return Response.json(response)
  } catch (error: any) {
    console.error('Error in tooltip proxy API:', error)
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    )
  }
}
