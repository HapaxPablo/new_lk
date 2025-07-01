import { NextRequest, NextResponse } from 'next/server'
import { getRouteSession } from '@/lib/session'

export async function POST(request: Request) {
  try {
    // Создаем объекты request/response
    const req = new NextRequest(request.url, { headers: request.headers })
    const res = new NextResponse()
    
    // Получаем и очищаем сессию
    const session = await getRouteSession(req, res)
    session.destroy()
    
    // Возвращаем ответ с очищенными cookies
    return new NextResponse(
      JSON.stringify({ message: 'Logged out successfully' }),
      { headers: res.headers }
    )
    
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: 'Logout failed' },
      { status: 500 }
    )
  }
}