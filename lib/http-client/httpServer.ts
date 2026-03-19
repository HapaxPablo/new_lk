import { THttpMethod } from '@/types'
import { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

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
    this.baseUrl = process.env.API_1C_URL || 'https://api1.krasrm.com/'
  }

  private async getSessionData(request: NextRequest) {
    try {
      const res = new Response()
      const cookieHeader = request.headers.get('cookie')
      if (!cookieHeader) {
        console.log('No cookies in request, returning null')
        return null
      }

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

  private async getSessionFromCookies(cookieStore: ReadonlyRequestCookies) {
    try {
      // Создаем Request объект из cookieStore
      const url = new URL('http://localhost')
      const headers = new Headers()

      const allCookies = cookieStore.getAll()
      if (allCookies.length > 0) {
        const cookieString = allCookies
          .map((cookie) => `${cookie.name}=${cookie.value}`)
          .join('; ')
        headers.set('cookie', cookieString)
      }

      const request = new Request(url, { headers })
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
      console.error('Error getting session from cookies:', error)
      return null
    }
  }

  private async getAuthData(
    source: NextRequest | ReadonlyRequestCookies,
    rawCookieHeader?: string
  ) {
    let token: string | null = null
    let xrmcCookie: string | undefined = undefined

    if (source instanceof NextRequest) {
      // Извлекаем из NextRequest
      // Используем raw cookie header если передан, иначе из request.cookies
      const cookieHeader = rawCookieHeader || source.headers.get('cookie') || ''

      // Пробуем извлечь токен из заголовка напрямую
      const tokenMatch = cookieHeader.match(/access_token=([^;]+)/)
      token = tokenMatch ? tokenMatch[1] : null

      const xrmcMatch = cookieHeader.match(/xrmcCookie=([^;]+)/)
      xrmcCookie = xrmcMatch ? xrmcMatch[1] : undefined

      // Если не нашли в заголовке, пробуем стандартный способ
      if (!token) {
        token =
          source.cookies.get('access_token')?.value ||
          source.headers.get('Authorization')?.replace('Bearer ', '') ||
          source.headers.get('x-access-token') ||
          source.headers.get('access-token')
      }

      if (!xrmcCookie) {
        const session = await this.getSessionData(source)
        xrmcCookie =
          session?.user?.xrmcCookie ||
          (typeof (source as any).cookies?.get === 'function'
            ? (source as any).cookies.get('xrmcCookie')?.value
            : null)
      }
    } else {
      // Извлекаем из cookieStore (ReadonlyRequestCookies)
      let tokenValue: string | null = null

      if (rawCookieHeader) {
        const tokenMatch = rawCookieHeader.match(/access_token=([^;]+)/)
        tokenValue = tokenMatch ? tokenMatch[1] : null

        const xrmcMatch = rawCookieHeader.match(/xrmcCookie=([^;]+)/)
        xrmcCookie = xrmcMatch ? xrmcMatch[1] : undefined
      }

      // Безопасно проверяем наличие .get() метода
      if (typeof (source as any).get === 'function') {
        token = tokenValue || (source as any).get('access_token')?.value || null
        if (!xrmcCookie) {
          xrmcCookie = (source as any).get('xrmcCookie')?.value
        }
      }

      if (!token) {
        token = null
      }

      if (!xrmcCookie) {
        const session = await this.getSessionFromCookies(source)
        xrmcCookie =
          session?.user?.xrmcCookie ||
          (typeof (source as any).get === 'function'
            ? (source as any).get('xrmcCookie')?.value
            : undefined)
      }
    }

    return { token, xrmcCookie }
  }

  private async request<T = any>(
    source: NextRequest | ReadonlyRequestCookies,
    method: THttpMethod,
    endpoint: string,
    data?: any,
    isFile: boolean = false,
    rawCookieHeader?: string
  ): Promise<T> {
    const { token, xrmcCookie } = await this.getAuthData(
      source,
      rawCookieHeader
    )

    console.log('Auth data:', {
      token: token ? 'present' : 'missing',
      xrmcCookie: xrmcCookie ? 'present' : 'missing',
    })

    const headers: Record<string, string> = {}

    if (token) {
      headers['Authorization'] = `access_token ${token}`
    }

    if (xrmcCookie) {
      headers['X-XRMC-Cookie'] = xrmcCookie
    }

    // Формируем Cookie заголовок
    const cookieParts: string[] = []
    if (token) {
      cookieParts.push(`access_token=${token}`)
    }
    if (xrmcCookie) {
      cookieParts.push(`xrmcCookie=${xrmcCookie}`)
    }

    if (cookieParts.length > 0) {
      headers['Cookie'] = cookieParts.join('; ')
    }

    if (source instanceof NextRequest) {
      headers['User-Agent'] = source.headers.get('user-agent') || ''
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
      config.body = JSON.stringify({})
    }

    console.log('Request to 1C:', {
      method,
      url: `${this.baseUrl}${endpoint}`,
      headers: {
        ...headers,
        Authorization: headers.Authorization ? '***' : undefined,
        Cookie: headers.Cookie ? '***' : undefined,
      },
    })

    const response = await fetch(`${this.baseUrl}${endpoint}`, config)

    console.log('Response from 1C:', {
      status: response.status,
      statusText: response.statusText,
    })

    if (response.status === 401) {
      console.log('401 Error - Session expired')
      throw new Error('Session expired')
    }

    if (!response.ok) {
      const error = await response.text()
      console.log('Error response body:', error)
      throw new Error(`Request failed: ${error}`)
    }

    if (isFile) {
      return response.blob() as Promise<T>
    }

    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  async get<T = any>(
    source: NextRequest | ReadonlyRequestCookies,
    endpoint: string,
    rawCookieHeader?: string
  ): Promise<T> {
    return this.request<T>(
      source,
      'GET',
      endpoint,
      undefined,
      false,
      rawCookieHeader
    )
  }

  async post<T = any>(
    source: NextRequest | ReadonlyRequestCookies,
    endpoint: string,
    data?: any,
    rawCookieHeader?: string
  ): Promise<T> {
    return this.request<T>(
      source,
      'POST',
      endpoint,
      data,
      false,
      rawCookieHeader
    )
  }

  async put<T = any>(
    source: NextRequest | ReadonlyRequestCookies,
    endpoint: string,
    data?: any,
    rawCookieHeader?: string
  ): Promise<T> {
    return this.request<T>(
      source,
      'PUT',
      endpoint,
      data,
      false,
      rawCookieHeader
    )
  }

  async patch<T = any>(
    source: NextRequest | ReadonlyRequestCookies,
    endpoint: string,
    data?: any,
    rawCookieHeader?: string
  ): Promise<T> {
    return this.request<T>(
      source,
      'PATCH',
      endpoint,
      data,
      false,
      rawCookieHeader
    )
  }

  async delete<T = any>(
    source: NextRequest | ReadonlyRequestCookies,
    endpoint: string,
    rawCookieHeader?: string
  ): Promise<T> {
    return this.request<T>(
      source,
      'DELETE',
      endpoint,
      undefined,
      false,
      rawCookieHeader
    )
  }

  async upload<T = any>(
    source: NextRequest | ReadonlyRequestCookies,
    endpoint: string,
    file: File,
    rawCookieHeader?: string
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    return this.request<T>(
      source,
      'POST',
      endpoint,
      formData,
      true,
      rawCookieHeader
    )
  }
}

export const httpClient1CServer = new HttpClient1CServer()
