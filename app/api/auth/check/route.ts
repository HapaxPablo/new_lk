import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('access_token')?.value
    console.log('token checkAuth', token)

    if (!token) {
      return NextResponse.json({ isAuthenticated: false, status: 200 })
    }

    const apiUrl = `${process.env.API_1C_URL}auth/jwt/verify/`
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({ token: token }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Cookie: `access_token=${token}`,
        'User-Agent': request.headers.get('user-agent') || '',
      },
    })

    console.log('response check auth', response)

    const data = await response.json()

    if (response.status === 200) {
      return NextResponse.json({ isAuthenticated: true })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({
      isAuthenticated: false,
      message: 'Ошибка проверки авторизации',
      status: 500,
    })
  }
}
