import { AuthResponse } from '@/types/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, new_password, new_password_confirm } = await request.json()

    if (!email || !new_password || !new_password_confirm) {
      return NextResponse.json({
        result: false,
        message: 'Email и пароль обязательны',
        status: 407,
      })
    }

    const apiUrl = `${process.env.API_1C_URL}api/users/reset-password/`
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || '',
      },
      body: JSON.stringify({ email, new_password, new_password_confirm }),
    })

    const data: AuthResponse = await response.json()

    if (!response.ok) {
      return NextResponse.json(data)
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
