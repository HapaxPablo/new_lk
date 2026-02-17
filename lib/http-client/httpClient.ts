'use client'

import { THttpMethod } from '@/types'

class HttpClient1CClient {
  private baseUrl: string
  private onLogout?: () => void

  constructor(token: string | null, onLogout?: () => void) {
    this.baseUrl = ''
    // this.baseUrl = process.env.NEXT_PUBLIC_API_1C_URL || '' локально не работает

    this.onLogout = onLogout
  }

  private async request<T = any>(
    method: THttpMethod,
    endpoint: string,
    data?: any,
    isFile = false
  ): Promise<T> {
    // Get token from cookie directly in client
    const cookies = document.cookie.split('; ')
    const tokenCookie = cookies.find((c) => c.startsWith('access_token='))
    const token = tokenCookie ? tokenCookie.split('=')[1] : null

    console.log('token client', token)

    // Проверяем, является ли эндпоинт публичным (GET запрос к nomenclatures, counterparties или promotions)
    const isPublicEndpoint =
      endpoint.includes('api/nomenclatures') ||
      endpoint.includes('api/counterparties') ||
      endpoint.includes('api/promotions')

    const headers: Record<string, string> = {}

    if (token) {
      headers['Authorization'] = `access_token ${token}`
      headers['Cookie'] = `access_token=${token}`
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
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config)

    if (response.status === 401) {
      window.location.href = '/login'
      throw new Error('Session expired')
    }

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }

    return isFile ? (response.blob() as Promise<T>) : response.json()
  }

  get<T>(url: string) {
    return this.request<T>('GET', url)
  }

  post<T>(url: string, data: any) {
    return this.request<T>('POST', url, data)
  }

  put<T>(url: string, data: any) {
    return this.request<T>('PUT', url, data)
  }

  patch<T>(url: string, data: any) {
    return this.request<T>('PATCH', url, data)
  }

  delete<T>(url: string) {
    return this.request<T>('DELETE', url)
  }

  // Загрузка файла
  async upload<T = any>(endpoint: string, file: File): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    return this.request<T>('POST', endpoint, formData, true)
  }
}

export class HttpClient1C {
  static client(token: string | null, logout?: () => void) {
    return new HttpClient1CClient(token, logout)
  }
}
