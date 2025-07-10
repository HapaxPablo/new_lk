import { AuthResponse } from '@/types/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({
        result: false,
        message: 'Email и пароль обязательны',
        status: 407,
      })
    }

    const apiUrl = `${process.env.API_1C_URL}/authorizeUser`
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || '',
      },
      body: JSON.stringify({ email, password }),
    })

    const data: AuthResponse = await response.json()

    if (!response.ok) {
      return NextResponse.json(data)
    }

    if (data.isAuthorized && data.xrmcCookie) {
      const res = NextResponse.json(data)
      res.cookies.set('xrmcCookie', data.xrmcCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })
      return res
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({
      result: false,
      message: 'Внутренняя ошибка сервера',
      status: 500,
    })
  }
}
