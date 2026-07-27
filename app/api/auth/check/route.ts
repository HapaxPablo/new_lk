import { NextRequest, NextResponse } from 'next/server'
import { HttpClient1C } from '@/lib/http-client'
import { IUserDetailsItem } from '@/types/user'

const EMPLOYEE_ROLES = ['superuser', 'admin', 'manager']

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

    // Получаем id юзера
    const me = await HttpClient1C.server(request).get<{ id: string }>(
      'auth/users/me/'
    )

    if (!me?.id) {
      return NextResponse.json({ isAuthenticated: true, isEmployee: false })
    }

    // Получаем детали юзера
    const user = await HttpClient1C.server(request).get<IUserDetailsItem>(
      `api/users/${me.id}/`
    )

    const isEmployee = EMPLOYEE_ROLES.includes(user?.role?.toLowerCase())

    return NextResponse.json({ isAuthenticated: true, isEmployee })
  } catch (error) {
    return NextResponse.json({
      isAuthenticated: false,
      isEmployee: false,
      message: 'Ошибка проверки авторизации',
    })
  }
}
