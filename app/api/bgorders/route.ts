import { NextRequest, NextResponse } from 'next/server'

interface BgOrderPayload {
  playlist: string
  clients: string[]
  name: string
  description?: string
  broadcast_interval: {
    lower: string
    upper: string
  }
  parameters?: Record<string, any>
  order_type: number
  is_permanent: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: BgOrderPayload = await request.json()

    if (!body.playlist || typeof body.playlist !== 'string') {
      return NextResponse.json(
        { error: 'Поле playlist обязательно для заполнения' },
        { status: 400 }
      )
    }

    if (!Array.isArray(body.clients) || body.clients.length === 0) {
      return NextResponse.json(
        { error: 'Поле clients должно содержать хотя бы одного клиента' },
        { status: 400 }
      )
    }

    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Поле name обязательно для заполнения' },
        { status: 400 }
      )
    }

    if (
      !body.broadcast_interval ||
      typeof body.broadcast_interval.lower !== 'string' ||
      typeof body.broadcast_interval.upper !== 'string'
    ) {
      return NextResponse.json(
        {
          error:
            'Поле broadcast_interval обязательно и должно содержать lower и upper',
        },
        { status: 400 }
      )
    }

    const forwardedBody: Record<string, any> = {
      playlist: body.playlist,
      clients: body.clients,
      name: body.name,
      description: body.description || undefined,
      broadcast_interval: body.broadcast_interval,
      parameters: body.parameters || {},
      order_type: typeof body.order_type === 'number' ? body.order_type : 0,
      is_permanent:
        typeof body.is_permanent === 'boolean' ? body.is_permanent : false,
    }

    const apiUrl = `${process.env.API_1C_URL}api/bgorders/`

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `access_token ${request.cookies.get('access_token')?.value || ''}`,
        Cookie: `access_token=${request.cookies.get('access_token')?.value || ''}`,
        'User-Agent': request.headers.get('user-agent') || '',
      },
      body: JSON.stringify(forwardedBody),
    })

    const responseData = await apiResponse.json().catch(() => null)

    if (!apiResponse.ok) {
      return NextResponse.json(
        {
          error: 'Ошибка при создании заказа фоновой музыки',
          detail: responseData,
        },
        { status: apiResponse.status }
      )
    }

    return NextResponse.json(responseData, { status: apiResponse.status })
  } catch (error: any) {
    console.error('Error in /api/bgorders POST handler:', error)

    if (error.message === 'Session expired') {
      return NextResponse.json(
        { detail: 'Нужно авторизоваться' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Ошибка при создании заказа фоновой музыки' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const apiUrl = new URL(`${process.env.API_1C_URL}api/bgorders/`)

    searchParams.forEach((value, key) => {
      apiUrl.searchParams.set(key, value)
    })

    const apiResponse = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        Authorization: `access_token ${request.cookies.get('access_token')?.value || ''}`,
        Cookie: `access_token=${request.cookies.get('access_token')?.value || ''}`,
        'User-Agent': request.headers.get('user-agent') || '',
      },
      cache: 'no-store',
    })

    const responseData = await apiResponse.json().catch(() => null)

    if (!apiResponse.ok) {
      return NextResponse.json(responseData, {
        status: apiResponse.status,
      })
    }

    return NextResponse.json(responseData, {
      status: apiResponse.status,
    })
  } catch (error: any) {
    console.error('Error in /api/bgorders GET handler:', error)

    return NextResponse.json(
      { error: 'Ошибка получения списка фоновых заказов' },
      { status: 500 }
    )
  }
}
