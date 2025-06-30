import { NextRequest, NextResponse } from 'next/server'
import { decryptData } from '@/lib/crypto'
import { httpClient1C } from '@/lib/api/HttpClient1C'
import { getRouteSession } from '@/lib/session'

export async function POST(req: Request) {
  try {
    const { email, password: encrypted } = await req.json()
    const password = decryptData(encrypted)

    // Используем httpClient1C 
    const { user, xrmcCookie } = await httpClient1C.post<{
      user: any;
      xrmcCookie: string
    }>('/auth', { email, password })

    // Создаем request/response для сессии
    const request = new NextRequest(req.url, {
      headers: req.headers,
      body: req.body
    })
    const response = new NextResponse()

    // Устанавливаем сессию
    const session = await getRouteSession(request, response)
    session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      xrmcCookie
    }
    await session.save()

    return new NextResponse(
      JSON.stringify({ 
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }),
      { headers: response.headers }
    )

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 401 }
    )
  }
}