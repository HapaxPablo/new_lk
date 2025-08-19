import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const apiUrl = `${process.env.API_1C_URL}auth/logout/`
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'User-Agent': request.headers.get('user-agent') || '',
        Cookie: request.cookies.toString(),
      },
    })

    const res = NextResponse.json({ success: true })
    res.cookies.delete('access_token')
    return res
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Внутренняя ошибка сервера',
      },
      { status: 500 }
    )
  }
}
