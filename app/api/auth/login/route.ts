import { NextResponse } from 'next/server'
import { httpClient1C } from '@/lib/api/HttpClient1C'


export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Отправляем запрос к 1С API
    const response = await fetch(`${process.env.API_1C_URL}/authorizeUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error('Authentication failed')
    }

    const data = await response.json()
    
    // Здесь вы должны получить куки от 1С и сохранить их в сессии
    const xrmcCookie = response.headers.get('xrmcCookie') || ''
console.log(data);

    return NextResponse.json({
      success: true,
      xrmcCookie,
      user: data.user,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 401 }
    )
  }
}

