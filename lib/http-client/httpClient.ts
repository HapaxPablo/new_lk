'use client'

import { THttpMethod } from '@/types'

class HttpClient1CClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_1C_URL || ''
  }

  private async request<T = any>(
    method: THttpMethod,
    endpoint: string,
    data?: any,
    isFile: boolean = false
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
      throw new Error(`Request failed: ${error}`)
    }

    return isFile ? (response.blob() as Promise<T>) : response.json()
  }

  // GET запрос
  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint)
  }

  // POST запрос
  async post<T = any>(endpoint: string, data: any): Promise<T> {
    return this.request<T>('POST', endpoint, data)
  }

  // PUT запрос
  async put<T = any>(endpoint: string, data: any): Promise<T> {
    return this.request<T>('PUT', endpoint, data)
  }

  // PATCH запрос
  async patch<T = any>(endpoint: string, data: any): Promise<T> {
    return this.request<T>('PATCH', endpoint, data)
  }

  // DELETE запрос
  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint)
  }

  // Загрузка файла
  async upload<T = any>(endpoint: string, file: File): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    return this.request<T>('POST', endpoint, formData, true)
  }
}

export const httpClient1CClient = new HttpClient1CClient()
