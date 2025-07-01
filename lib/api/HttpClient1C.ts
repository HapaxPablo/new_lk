import { getRouteSession } from '@/lib/session'
import { NextRequest, NextResponse } from 'next/server'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Универсальный HTTP-клиент для работы с API 1С
 * Обеспечивает аутентификацию, обработку ошибок и работу с разными типами данных
 */
class HttpClient1C {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseUrl = process.env.API_1C_URL!
    this.defaultHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }

  /**
   * Базовый метод для выполнения HTTP-запросов
   * @param endpoint - URL endpoint (без базового адреса)
   * @param method - HTTP-метод (GET, POST, PUT, PATCH, DELETE)
   * @param data - Тело запроса (для POST, PUT, PATCH)
   * @param isFile - Флаг отправки файла (меняет Content-Type)
   * @returns Promise с ответом от сервера
   * @throws Error при неудачном запросе
   *
   * Пример:
   * await request<Product[]>('/nomenclatures', 'GET')
   * await request<Product>('/nomenclatures', 'POST', newProduct)
   */
  async request<T = any>(
    endpoint: string,
    method: HttpMethod = 'GET',
    data?: any,
    isFile: boolean = false
  ): Promise<T> {
    const req = new NextRequest('http://localhost')
    const res = new NextResponse()

    const session = await getRouteSession(req, res)

    if (!session.user?.xrmcCookie) {
      throw new Error('Authentication required')
    }

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      'X-XRMC-Cookie': session.user.xrmcCookie,
    }

    const config: RequestInit = {
      method,
      headers,
      credentials: 'include',
    }

    if (data) {
      if (isFile) {
        config.body = data
        delete headers['Content-Type'] // Удаляем для FormData
      } else {
        config.body = JSON.stringify(data)
      }
    }
    console.log('Full 1C URL:', `${this.baseUrl}${endpoint}`);
    const response = await fetch(`${this.baseUrl}${endpoint}`, config)

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`1C Error: ${error}`)
    }

    // Явное приведение типов для файлов
    return isFile ? (response.blob() as Promise<T>) : response.json()
  }

  /**
   * GET-запрос для получения данных
   * @param endpoint - URL endpoint
   * @returns Promise с данными ответа
   *
   * Пример:
   * const products = await get<Product[]>('/nomenclatures')
   * const product = await get<Product>('/nomenclatures/123')
   */
  get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint)
  }

  /**
   * POST-запрос для создания данных
   * @param endpoint - URL endpoint
   * @param data - Данные для отправки
   * @returns Promise с созданным ресурсом
   *
   * Пример:
   * const newProduct = await post<Product>('/nomenclatures', productData)
   */
  post<T = any>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, 'POST', data)
  }

  /**
   * Загрузка файла на сервер
   * @param endpoint - URL endpoint для загрузки
   * @param file - Файл для отправки
   * @returns Promise с Blob-ответом
   *
   * Пример:
   * const result = await uploadFile('/upload', file)
   */
  uploadFile(endpoint: string, file: File): Promise<Blob> {
    const formData = new FormData()
    formData.append('file', file)
    return this.request<Blob>(endpoint, 'POST', formData, true)
  }

  /**
   * PUT-запрос для полного обновления ресурса
   * @param endpoint - URL endpoint
   * @param data - Полный набор данных для обновления
   * @returns Promise с обновленным ресурсом
   *
   * Пример:
   * const updated = await put<Product>('/nomenclatures/123', productData)
   */
  put<T = any>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, 'PUT', data)
  }

  /**
   * PATCH-запрос для частичного обновления ресурса
   * @param endpoint - URL endpoint
   * @param data - Частичные данные для обновления
   * @returns Promise с обновленным ресурсом
   *
   * Пример:
   * const updated = await patch<Product>('/nomenclatures/123', {price: 100})
   */
  patch<T = any>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, 'PATCH', data)
  }

  /**
   * DELETE-запрос для удаления ресурса
   * @param endpoint - URL endpoint
   * @returns Promise с результатом удаления
   *
   * Пример:
   * await delete('/nomenclatures/123')
   */
  delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, 'DELETE')
  }

  /**
   * DELETE-запрос с телом запроса
   * @param endpoint - URL endpoint
   * @param data - Данные для отправки
   * @returns Promise с результатом удаления
   *
   * Пример:
   * await deleteWithBody('/nomenclatures/123', {reason: "Устарело"})
   */
  deleteWithBody<T = any>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', data)
  }

  /**
   * Получение медиафайла (изображение, аудио, видео)
   * @param endpoint - URL endpoint
   * @param responseType - Тип возвращаемых данных ('blob' или 'arraybuffer')
   * @returns Promise с Blob или ArrayBuffer
   *
   * Пример:
   * const imageBlob = await getMedia('/products/123/image')
   * const audioBuffer = await getMedia('/audio/123', 'arraybuffer')
   */
  async getMedia(
    endpoint: string,
    responseType: 'blob' | 'arraybuffer' = 'blob'
  ): Promise<Blob | ArrayBuffer> {
    const req = new NextRequest('http://localhost')
    const res = new NextResponse()

    const session = await getRouteSession(req, res)

    if (!session.user?.xrmcCookie) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'X-XRMC-Cookie': session.user.xrmcCookie,
      },
    })

    if (!response.ok) {
      throw new Error(`Media request failed: ${response.statusText}`)
    }

    return responseType === 'blob' ? response.blob() : response.arrayBuffer()
  }

  /**
   * Скачивание файла с сервера
   * @param endpoint - URL endpoint
   * @param filename - Имя файла для сохранения
   * @returns Promise с объектом {blob: Blob, filename: string}
   *
   * Пример:
   * const {blob, filename} = await downloadFile('/reports/123', 'report.pdf')
   */
  async downloadFile(
    endpoint: string,
    filename: string
  ): Promise<{ blob: Blob; filename: string }> {
    const blob = (await this.getMedia(endpoint)) as Blob
    return { blob, filename }
  }
}

export const httpClient1C = new HttpClient1C()