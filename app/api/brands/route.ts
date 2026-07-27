import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Получаем все возможные параметры
    const search = searchParams.get('search') || searchParams.get('name') || ''
    const code1c = searchParams.get('code1c') || ''
    const isDeleted = searchParams.get('is_deleted') || 'false'
    const limit = searchParams.get('limit') || '50'
    const page = searchParams.get('page') || '1'

    // Формируем URL для 1C API
    const apiUrl = new URL('https://api1.krasrm.com/api/brands/')

    // Добавляем параметры поиска
    if (search) {
      apiUrl.searchParams.set('name', search)
    }
    if (code1c) {
      apiUrl.searchParams.set('code1c', code1c)
    }
    if (isDeleted) {
      apiUrl.searchParams.set('is_deleted', isDeleted)
    }
    if (limit) {
      apiUrl.searchParams.set('limit', limit)
    }
    if (page) {
      apiUrl.searchParams.set('page', page)
    }

    // console.log('API URL:', apiUrl.toString())

    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch brands' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in brands API route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
