import { AuthResponse } from '@/types/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({
        result: false,
        message: 'Email и пароль обязательны',
        status: 407,
      })
    }

    const apiUrl = `${process.env.API_1C_URL}authorizeUser`
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
      res.cookies.set({
        name: 'xrmcCookie',
        value: data.xrmcCookie,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 дней (в секундах)
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 дней
      })
      // console.log('res auth', res)
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
