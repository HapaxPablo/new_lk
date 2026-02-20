import { NextRequest } from 'next/server'
import { HttpClient1C } from '@/lib/http-client'
import { httpClient1CServer } from '@/lib/http-client/httpServer'

/**
 * API-прокси для тултипов.
 * Выполняет запрос к 1С API от имени сервера с автоматической авторизацией.
 * Использует тот же подход что и страницы (app/(main)/counterparties/[id]/page.tsx)
 *
 * Для брендов используется прямой URL https://api1.krasrm.com/api/brands/{id}
 */

const BRANDS_API_BASE_URL = process.env.API_1C_URL

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  // endpoint приходит как параметр, например: /api/brands/123 или api/brands/123/
  const endpoint = searchParams.get('endpoint')

  if (!endpoint) {
    return Response.json({ error: 'Endpoint is required' }, { status: 400 })
  }

  try {
    // Получаем cookie заголовок напрямую из запроса
    const cookieHeader = request.headers.get('cookie') || ''

    console.log('[Tooltip API] Request received:', {
      endpoint,
      hasCookieHeader: !!cookieHeader,
      cookieHeaderLength: cookieHeader.length,
      cookies: cookieHeader.substring(0, 100) + '...',
    })

    // Проверяем авторизацию
    const tokenMatch = cookieHeader.match(/access_token=([^;]+)/)
    if (!tokenMatch) {
      console.log('[Tooltip API] No access token found in cookies')
      return Response.json({ error: 'Необходима авторизация' }, { status: 401 })
    }

    const token = tokenMatch[1]
    const xrmcMatch = cookieHeader.match(/xrmcCookie=([^;]+)/)
    const xrmcCookie = xrmcMatch ? xrmcMatch[1] : undefined

    // Убираем начальный слеш если есть
    const cleanEndpoint = endpoint.startsWith('/')
      ? endpoint.slice(1)
      : endpoint

    console.log('[Tooltip API] Fetching from:', cleanEndpoint)

    // Для брендов используем прямой URL https://api1.krasrm.com/api/brands/{id}
    if (cleanEndpoint.startsWith('api/brands/')) {
      console.log(
        '[Tooltip API] Using direct URL for brands:',
        `${BRANDS_API_BASE_URL}${cleanEndpoint}`
      )

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `access_token ${token}`,
        Cookie: `access_token=${token}`,
      }

      if (xrmcCookie) {
        headers['X-XRMC-Cookie'] = xrmcCookie
        headers['Cookie'] += `; xrmcCookie=${xrmcCookie}`
      }

      const response = await fetch(`${BRANDS_API_BASE_URL}${cleanEndpoint}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      })

      console.log('[Tooltip API] Brands response status:', response.status)

      if (response.status === 401) {
        return Response.json(
          { error: 'Сессия истекла. Пожалуйста, войдите снова.' },
          { status: 401 }
        )
      }

      if (!response.ok) {
        const error = await response.text()
        console.log('[Tooltip API] Brands error response:', error)
        throw new Error(`Request failed: ${error}`)
      }

      const result = await response.json()
      console.log('[Tooltip API] Brands response received:', result)
      return Response.json(result)
    }

    // Для остальных endpoint используем HttpClient1C.server
    console.log(
      '[Tooltip API] Making request to 1C with endpoint:',
      cleanEndpoint
    )

    let response
    try {
      response = await HttpClient1C.server(request).get(cleanEndpoint)
    } catch (fetchError: any) {
      console.error('[Tooltip API] Fetch error:', fetchError)
      console.error('[Tooltip API] Fetch error message:', fetchError.message)
      console.error('[Tooltip API] Fetch error stack:', fetchError.stack)
      throw fetchError
    }

    console.log('[Tooltip API] Response received:', response)

    return Response.json(response)
  } catch (error: any) {
    console.error('[Tooltip API] Error:', error)

    // Обработка ошибки авторизации
    if (error.message === 'Session expired' || error.message.includes('401')) {
      return Response.json(
        { error: 'Сессия истекла. Пожалуйста, войдите снова.' },
        { status: 401 }
      )
    }

    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    )
  }
}
