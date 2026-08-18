import { NextRequest, NextResponse } from 'next/server'
import { HttpClient1C } from '@/lib/http-client'
import { ICurrentUser, isEmployeeRole } from '@/types/user'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('access_token')?.value

    if (!token) {
      return NextResponse.json({ isAuthenticated: false, isEmployee: false })
    }

    const apiUrl = `${process.env.API_1C_URL}auth/jwt/verify/`
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `access_token ${token}`,
        Cookie: `access_token=${token}`,
        'User-Agent': request.headers.get('user-agent') || '',
      },
    })

    if (response.status !== 200) {
      return NextResponse.json({ isAuthenticated: false, isEmployee: false })
    }

    const user = await HttpClient1C.server(request).get<ICurrentUser>(
      'api/users/me/'
    )
    const isEmployee = isEmployeeRole(user.role)

    return NextResponse.json({ isAuthenticated: true, isEmployee })
  } catch (error) {
    return NextResponse.json({
      isAuthenticated: false,
      isEmployee: false,
      message: 'Ошибка проверки авторизации',
    })
  }
}
