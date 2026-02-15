import { THttpMethod } from '@/types'
import { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'

// Declare the session data type
declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: string
      name: string
      email: string
      xrmcCookie?: string
    }
  }
}

class HttpClient1CServer {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.API_1C_URL || ''
  }

  // Helper to get session and xrmcCookie
  private async getSessionData(request: NextRequest) {
    try {
      // Create a mock response for iron-session
      const res = new Response()
      const session = await getIronSession<any>(request, res, {
        password:
          process.env.SESSION_SECRET ||
          'complex_password_at_least_32_characters',
        cookieName: '1c_auth_session',
        cookieOptions: {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict' as const,
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
        },
      })
      return session
    } catch (error) {
      console.error('Error getting session:', error)
      return null
    }
  }

  private async request<T = any>(
    request: NextRequest,
    method: THttpMethod,
    endpoint: string,
    data?: any,
    isFile: boolean = false
  ): Promise<T> {
    // Get token directly from request cookies
    const token = request.cookies.get('access_token')?.value
    console.log('token httpServer', token)

    // Get xrmcCookie from session (required by 1C API)
    const session = await this.getSessionData(request)
    const xrmcCookie = session?.user?.xrmcCookie
    console.log('xrmcCookie httpServer', xrmcCookie)

    // Проверяем, является ли эндпоинт публичным (GET запрос к nomenclatures, counterparties или promotions)
    // ПРИМЕЧАНИЕ: Внешний API (api1.krasrm.com) требует аутентификацию даже для этих эндпоинтов
    const isPublicEndpoint =
      method === 'GET' &&
      (endpoint.includes('nomenclatures') ||
        endpoint.includes('counterparties') ||
        endpoint.includes('promotions') ||
        endpoint.includes('tasks') ||
        endpoint.includes('media-plans'))

    const headers: Record<string, string> = {}

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      // Добавляем Cookie header - 1C API может требовать его
      headers['Cookie'] = `access_token=${token}`
    }

    // Добавляем User-Agent как в check/route.ts
    headers['User-Agent'] = request.headers.get('user-agent') || ''

    // Пробуем добавить xrmcCookie если есть в cookie
    const xrmcCookieValue = request.cookies.get('xrmcCookie')?.value
    if (xrmcCookieValue) {
      headers['X-XRMC-Cookie'] = xrmcCookieValue
    }

    if (!isFile) {
      headers['Content-Type'] = 'application/json'
    }

    const config: RequestInit = {
      method,
      headers,
      credentials: 'include',
    }

    if (data) {
      config.body = isFile ? data : JSON.stringify(data)
    } else if (method !== 'GET') {
      // Для не-GET запросов без данных, добавляем пустой объект
      // Это может помочь с аутентификацией
      config.body = JSON.stringify({})
    }
    console.log('headers:', headers)
    console.log('fullUrl:', `${this.baseUrl}${endpoint}`, config)
    const response = await fetch(`${this.baseUrl}${endpoint}`, config)

    // Логируем заголовки ответа для отладки
    console.log('Response status:', response.status)
    console.log('Response statusText:', response.statusText)
    console.log(
      'Response headers:',
      Object.fromEntries(response.headers.entries())
    )

    if (response.status === 401) {
      // Если это публичный эндпоинт и токена нет/истек
      if (isPublicEndpoint && !token) {
        console.log('Public endpoint but no token, returning empty result')
        // Для публичных эндпоинтов возвращаем пустой ответ
        return [] as any
      }

      // Если есть токен, возможно он истек - возвращаем ошибку сессии
      throw new Error('Session expired')
    }

    if (!response.ok) {
      const error = await response.text()
      console.log('Error response body:', error)
      throw new Error(`Request failed: ${error}`)
    }

    return isFile ? (response.blob() as Promise<T>) : response.json()
  }

  // GET запрос
  async get<T = any>(request: NextRequest, endpoint: string): Promise<T> {
    return this.request<T>(request, 'GET', endpoint)
  }

  // POST запрос
  async post<T = any>(
    request: NextRequest,
    endpoint: string,
    data: any
  ): Promise<T> {
    return this.request<T>(request, 'POST', endpoint, data)
  }

  // PUT запрос
  async put<T = any>(
    request: NextRequest,
    endpoint: string,
    data: any
  ): Promise<T> {
    return this.request<T>(request, 'PUT', endpoint, data)
  }

  // PATCH запрос
  async patch<T = any>(
    request: NextRequest,
    endpoint: string,
    data: any
  ): Promise<T> {
    return this.request<T>(request, 'PATCH', endpoint, data)
  }

  // DELETE запрос
  async delete<T = any>(request: NextRequest, endpoint: string): Promise<T> {
    return this.request<T>(request, 'DELETE', endpoint)
  }

  // Загрузка файла
  async upload<T = any>(
    request: NextRequest,
    endpoint: string,
    file: File
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    return this.request<T>(request, 'POST', endpoint, formData, true)
  }
}

export const httpClient1CServer = new HttpClient1CServer()
