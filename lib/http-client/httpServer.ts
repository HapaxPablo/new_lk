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
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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
    // Get token from cookies or from headers (set by middleware)
    let token = request.cookies.get('access_token')?.value

    // Also check if token was set by middleware in headers
    if (!token) {
      token = request.headers.get('Authorization')?.replace('Bearer ', '')
    }

    console.log('token httpServer', token)

    // Get xrmcCookie from session (required by 1C API for some endpoints)
    const session = await this.getSessionData(request)
    const xrmcCookie = session?.user?.xrmcCookie
    console.log('xrmcCookie from session httpServer', xrmcCookie)

    // Also try to get xrmcCookie directly from browser cookies
    const xrmcCookieFromBrowser = request.cookies.get('xrmcCookie')?.value
    console.log('xrmcCookie from browser httpServer', xrmcCookieFromBrowser)

    // Use whichever is available
    const xrmcCookieValue = xrmcCookie || xrmcCookieFromBrowser

    const headers: Record<string, string> = {}

    if (token) {
      // Используем формат как в Swagger: "access_token <token>" вместо "Bearer <token>"
      headers['Authorization'] = `access_token ${token}`
      // Также добавляем в Cookie header
      headers['Cookie'] = `access_token=${token}`
    }

    // Добавляем User-Agent как в check/route.ts
    headers['User-Agent'] = request.headers.get('user-agent') || ''

    // Добавляем xrmcCookie если есть (критически важно для некоторых эндпоинтов 1C API)
    if (xrmcCookieValue) {
      headers['X-XRMC-Cookie'] = xrmcCookieValue
      // Also add it to Cookie header
      headers['Cookie'] =
        (headers['Cookie'] || '') + `; xrmcCookie=${xrmcCookieValue}`
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
      // Если есть токен, возможно он истек - возвращаем ошибку сессии
      console.log('401 Error - Token:', token ? 'present' : 'missing')
      console.log(
        '401 Error - xrmcCookie:',
        xrmcCookieValue ? 'present' : 'missing'
      )
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
