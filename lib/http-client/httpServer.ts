import { THttpMethod } from '@/types'
import { NextRequest } from 'next/server'
import { getToken } from '../token/getToken'

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
    const token = await getToken()
    console.log('token httpServer', token)

    // Проверяем, является ли эндпоинт публичным (GET запрос к nomenclatures или counterparties)
    const isPublicEndpoint =
      method === 'GET' &&
      (endpoint.includes('api/nomenclatures') ||
        endpoint.includes('api/counterparties'))

    // console.log('request.cookies', request.cookies)
    if (!token && !isPublicEndpoint) {
      throw new Error('Authentication required')
    }

    // const headers: Record<string, string> = {
    //   Authorization: `access_token ${token ?? ''}`,
    //   Cookie: `access_token ${token ?? ''}`,
    // }

    const headers: Record<string, string> = {}

    if (token) {
      headers['Authorization'] = `access_token ${token}`
      headers['Cookie'] = `access_token ${token}`
    }

    if (!isFile) {
      headers['Content-Type'] = 'application/json'
    }

    const config: RequestInit = {
      method,
      headers,
      credentials: isPublicEndpoint ? 'omit' : 'include',
    }

    if (data) {
      config.body = isFile ? data : JSON.stringify(data)
    }
    console.log('headers:', headers)
    console.log('fullUrl:', `${this.baseUrl}${endpoint}`, config)
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
