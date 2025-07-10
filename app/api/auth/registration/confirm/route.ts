import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const apiUrl = `${process.env.API_1C_URL}/registrationConfirm`
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

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({
      result: false,
      message: 'Внутренняя ошибка сервера',
      status: 500,
    })
  }
}
