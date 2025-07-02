import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { result: false, message: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    // Запрос к 1С API
    const apiUrl = `${process.env.API_1C_URL}/authorizeUser`
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { result: false, message: 'Ошибка соединения с сервером 1С' },
        { status: 500 }
      )
    }

    // Если авторизация успешна, устанавливаем cookie
    if (data.result && data.xrmccookie) {
      const res = NextResponse.json(data)
      res.cookies.set('xrmccookie', data.xrmccookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })
      return res
    }

    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json(
      { result: false, message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}