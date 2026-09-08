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

    // Проверяем авторизацию
    const tokenMatch = cookieHeader.match(/access_token=([^;]+)/)
    if (!tokenMatch) {
      return Response.json({ error: 'Необходима авторизация' }, { status: 401 })
    }

    const token = tokenMatch[1]
    const xrmcMatch = cookieHeader.match(/xrmcCookie=([^;]+)/)
    const xrmcCookie = xrmcMatch ? xrmcMatch[1] : undefined

    // Убираем начальный слеш если есть
    const cleanEndpoint = endpoint.startsWith('/')
      ? endpoint.slice(1)
      : endpoint

    // Для брендов используем прямой URL https://api1.krasrm.com/api/brands/{id}
    if (cleanEndpoint.startsWith('api/brands/')) {
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

      if (response.status === 401) {
        return Response.json(
          { error: 'Сессия истекла. Пожалуйста, войдите снова.' },
          { status: 401 }
        )
      }

      if (!response.ok) {
        const error = await response.text()
        // Логируем только статус — тело upstream не шлём в лог
        console.error('[api/tooltip] brands upstream error', {
          status: response.status,
        })
        throw new Error(`Request failed: ${error}`)
      }

      const result = await response.json()
      return Response.json(result)
    }

    // Для остальных endpoint используем HttpClient1C.server
    let response
    try {
      response = await HttpClient1C.server(request).get(cleanEndpoint)
    } catch (fetchError: any) {
      console.error('[api/tooltip] fetch failed', {
        status: fetchError.status || 500,
      })
      throw fetchError
    }

    return Response.json(response)
  } catch (error: any) {
    console.error('[api/tooltip] error', {
      status: error.status || 500,
    })

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
