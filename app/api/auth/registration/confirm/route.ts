import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const apiUrl = `${process.env.API_1C_URL}registrationConfirm`
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || '',
      },
      body: JSON.stringify({ ...body }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data)
    }
    if (data.result && data.xrmcCookie) {
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
      console.log('res reg', res)
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
