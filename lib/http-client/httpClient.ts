'use client'
//tets
import { useAuth } from '@/providers/auth-provider/AuthProvider'
import { THttpMethod } from '@/types'
import { getToken } from '../token/getToken'

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
    const token = getToken()
    if (!token) {
      this.onLogout?.()
      throw new Error('Authentication required')
    }

    console.log('FETCH TO:', this.baseUrl + endpoint)

    const headers: Record<string, string> = {
      Authorization: `access_token ${token}`,
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
      this.onLogout?.()
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
