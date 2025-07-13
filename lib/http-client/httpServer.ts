import { THttpMethod } from '@/types'
import { NextRequest } from 'next/server'


class HttpClient1CServer {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.API_1C_URL || ''
  }

  private async request<T = any>(
    request: NextRequest,
    method: THttpMethod,
    endpoint: string,
    data?: any,
    isFile: boolean = false
  ): Promise<T> {
    const token = request.cookies.get('xrmcCookie')?.value

    if (!token) {
      throw new Error('Authentication required')
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      'Cookie': `xrmcCookie=${token}`,
    }

    if (!isFile) {
      headers['Content-Type'] = 'application/json'
    }

    const config: RequestInit = {
      method,
      headers,
    }

    if (data) {
      config.body = isFile ? data : JSON.stringify(data)
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config)

    if (response.status === 401) {
      throw new Error('Session expired')
    }

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Request failed: ${error}`)
    }

    return isFile ? (response.blob() as Promise<T>) : response.json()
  }

  // GET запрос
  async get<T = any>(request: NextRequest, endpoint: string): Promise<T> {
    return this.request<T>(request, 'GET', endpoint)
  }

  // POST запрос
  async post<T = any>(request: NextRequest, endpoint: string, data: any): Promise<T> {
    return this.request<T>(request, 'POST', endpoint, data)
  }

  // PUT запрос
  async put<T = any>(request: NextRequest, endpoint: string, data: any): Promise<T> {
    return this.request<T>(request, 'PUT', endpoint, data)
  }

  // PATCH запрос
  async patch<T = any>(request: NextRequest, endpoint: string, data: any): Promise<T> {
    return this.request<T>(request, 'PATCH', endpoint, data)
  }

  // DELETE запрос
  async delete<T = any>(request: NextRequest, endpoint: string): Promise<T> {
    return this.request<T>(request, 'DELETE', endpoint)
  }

  // Загрузка файла
  async upload<T = any>(request: NextRequest, endpoint: string, file: File): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    return this.request<T>(request, 'POST', endpoint, formData, true)
  }
}

export const httpClient1CServer = new HttpClient1CServer()