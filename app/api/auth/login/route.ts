import { getRouteSession } from '@/lib/session'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Создаем объекты для сессии
    const req = new NextRequest(request.url, {
      headers: request.headers,
      body: request.body,
    })
    const res = new NextResponse()

    // Аутентификация в 1С
    const response1C = await fetch(`${process.env.API_1C_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response1C.ok) {
      throw new Error('1C authentication failed')
    }

    const { user, xrmcCookie } = await response1C.json()

    if (!xrmcCookie) {
      throw new Error('XRMC cookie not received from 1C')
    }

    // Сохраняем сессию
    const session = await getRouteSession(req, res)
    session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      xrmcCookie,
    }
    await session.save()

    // Возвращаем ответ с куками
    return new NextResponse(
      JSON.stringify({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      }),
      {
        headers: res.headers,
      }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Authentication failed',
      },
      { status: 401 }
    )
  }
}
