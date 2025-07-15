import { NextRequest, NextResponse } from 'next/server'
//TODO добавить метод проверки токена в 1с желательно сделать токен со сроком жизни
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('xrmcCookie')?.value
    // console.log(token);
    if (!token) {
      return NextResponse.json({ isAuthenticated: false, status: 200 })
    }

    const apiUrl = `${process.env.API_1C_URL}/checkAuth`
    const response = await fetch(apiUrl, {
      headers: {
        Cookie: `xrmcCookie=${token}`,
        'User-Agent': request.headers.get('user-agent') || '',
      },
    })

    const data = await response.json()

    return NextResponse.json({
      isAuthenticated: data.isValid,
      status: response.ok ? 200 : 401,
    })
  } catch (error) {
    return NextResponse.json({
      isAuthenticated: false,
      message: 'Ошибка проверки авторизации',
      status: 500,
    })
  }
}
