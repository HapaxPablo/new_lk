// app/api/cities/route.ts (упрощенная версия)

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.8:8000'
    const params = new URLSearchParams()

    if (search) {
      params.set('search', search)
    }

    const url = `${backendUrl}/api/cities/?${params.toString()}`

    // console.log('Fetching cities from:', url)

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache', // Используем кэширование для оптимизации производительности
    })

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }

    const data = await response.json()

    // Прокидываем данные как есть (теперь это массив)
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Error in cities API route:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
