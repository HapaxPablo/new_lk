import { NextRequest, NextResponse } from 'next/server'
import { getRouteSession } from '@/lib/session'
export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    // Создаем объекты request/response для iron-session
    const req = new NextRequest(request.url, {
      headers: request.headers
    })
    const res = new NextResponse()

    // Получаем сессию
    const session = await getRouteSession(req, res)

    if (!session.user) {
      return NextResponse.json({ user: null }, { headers: res.headers })
    }

    // Возвращаем только необходимые данные пользователя (без xrmcCookie)
    const userData = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email
    }

    return new NextResponse(
      JSON.stringify({ user: userData }),
      { headers: res.headers }
    )

  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}