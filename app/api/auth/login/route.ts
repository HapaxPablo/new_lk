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

    const apiUrl = `${process.env.API_1C_URL}auth/jwt/create/`
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

    if (data.refresh && data.access) {
      const res = NextResponse.json(data)

      const isProduction = process.env.NODE_ENV === 'production'

      console.log('[Login] Cookie settings:', {
        isProduction,
        tokenLength: data.access.length,
        cookieName: 'access_token',
      })

      // Устанавливаем куку с правильными настройками для продакшена
      // Не указываем domain явно - Next.js определит его автоматически
      res.cookies.set({
        name: 'access_token',
        value: data.access,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 дней (в секундах)
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 дней
      })

      console.log('[Login] Cookie set successfully')

      return res
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      result: false,
      message: 'Внутренняя ошибка сервера',
      status: 500,
    })
  }
}
