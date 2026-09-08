import { THttpMethod } from '@/types'
import { NextRequest } from 'next/server'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { fetchWithRetry, type FetchWithRetryOptions } from './fetchWithRetry'

class HttpClient1CServer {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.API_1C_URL || 'https://api1.krasrm.com/'
  }

  private isNextRequest(source: any): source is NextRequest {
    return (
      typeof source?.headers?.get === 'function' &&
      typeof source?.cookies?.getAll === 'function'
    )
  }

  private getAuthData(
    source: NextRequest | ReadonlyRequestCookies,
    rawCookieHeader?: string
  ) {
    let token: string | null = null

    if (this.isNextRequest(source)) {
      const cookieHeader = rawCookieHeader || source.headers.get('cookie') || ''

      const tokenMatch = cookieHeader.match(/access_token=([^;]+)/)
      token = tokenMatch ? tokenMatch[1] : null

      if (!token) {
        token =
          source.cookies.get('access_token')?.value ||
          source.headers.get('Authorization')?.replace('Bearer ', '') ||
          source.headers.get('x-access-token') ||
          source.headers.get('access-token') ||
          null
      }
    } else {
      const cookieStore = source as ReadonlyRequestCookies

      let tokenValue: string | null = null

      if (rawCookieHeader) {
        const tokenMatch = rawCookieHeader.match(/access_token=([^;]+)/)
        tokenValue = tokenMatch ? tokenMatch[1] : null
      }

      token = tokenValue || cookieStore.get('access_token')?.value || null
    }

    return { token }
  }

  private async request<T = any>(
    source: NextRequest | ReadonlyRequestCookies,
    method: THttpMethod,
    endpoint: string,
    data?: any,
    isFile: boolean = false,
    rawCookieHeader?: string,
    fetchOptions?: FetchWithRetryOptions
  ): Promise<T> {
    const { token } = this.getAuthData(source, rawCookieHeader)

    const headers: Record<string, string> = {}

    if (token) {
      headers['Authorization'] = `access_token ${token}`
    }

    // Формируем Cookie заголовок
    if (token) {
      headers['Cookie'] = `access_token=${token}`
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

    const response = await fetchWithRetry(
      `${this.baseUrl}${endpoint}`,
      config,
      fetchOptions
    )

    if (response.status === 401) {
      throw new Error('Session expired')
    }

    if (!response.ok) {
      const error = await response.text()
      const requestError = new Error(`Request failed: ${error}`) as Error & {
        status: number
      }
      requestError.status = response.status
      throw requestError
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

  async postReadOnly<T = any>(
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
      rawCookieHeader,
      { readOnly: true }
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
