import { NextRequest, NextResponse } from 'next/server'

interface AdOrderPayload {
  playlist: string
  clients: string[]
  name: string
  description?: string
  broadcast_interval: {
    lower: string
    upper: string
  }
  broadcast_type: number
  parameters?: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const body: AdOrderPayload = await request.json()

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

    const apiUrl = `${process.env.API_1C_URL}api/adorders/`

    const normalizeTime = (value?: string) => {
      if (!value) return value
      if (/^\d{2}:\d{2}$/.test(value)) return `${value}:00`
      return value
    }

    const normalizeBroadcastParameter = (value?: string) => {
      if (!value) return value
      if (/^\d{2}:\d{2}$/.test(value)) return `${value}:00`
      return value
    }

    const parameters = body.parameters || {}

    if (!body.parameters) {
      return NextResponse.json(
        { error: 'Не переданы параметры заказа' },
        { status: 400 }
      )
    }

    if (
      body.parameters.times_in_hour === undefined ||
      body.parameters.times_in_hour === null
    ) {
      return NextResponse.json(
        { error: 'Не указан обязательный параметр: кол-во выходов в час' },
        { status: 400 }
      )
    }

    const timesInHour = Number(body.parameters.times_in_hour)
    const allowedTimes = [1, 2, 3, 4, 6, 12]
    if (!allowedTimes.includes(timesInHour)) {
      return NextResponse.json(
        { error: 'Такого кол-ва выходов в час нет в списке допустимых' },
        { status: 400 }
      )
    }

    const weight = body.parameters.weight
    if (weight !== undefined && weight !== null) {
      const weightValue = Number(weight)
      if (Number.isNaN(weightValue) || weightValue < 0 || weightValue > 100) {
        return NextResponse.json(
          { error: 'Приоритет файла должен быть в пределах от 0 до 100' },
          { status: 400 }
        )
      }
    }

    const broadcastType = Number(body.broadcast_type)
    const normalizedParameters = {
      ...parameters,
      start_time: normalizeBroadcastParameter(parameters.start_time),
      end_time: normalizeBroadcastParameter(parameters.end_time),
      timedelta: normalizeBroadcastParameter(parameters.timedelta),
    }

    const hasStartTime = !!normalizedParameters.start_time
    const hasEndTime = !!normalizedParameters.end_time
    const hasTimedelta = !!normalizedParameters.timedelta

    if (broadcastType === 1 || broadcastType === 2) {
      if (!hasTimedelta) {
        return NextResponse.json(
          {
            error:
              'Необходимо указать смещение по времени для данного типа вещания',
          },
          { status: 400 }
        )
      }
    }

    if (broadcastType === 3) {
      if (!hasStartTime || !hasEndTime) {
        return NextResponse.json(
          {
            error:
              'Необходимо указать время начала и окончания для данного типа вещания',
          },
          { status: 400 }
        )
      }
    }

    if (broadcastType === 4) {
      if (!hasEndTime) {
        return NextResponse.json(
          {
            error:
              'Необходимо указать время окончания для данного типа вещания',
          },
          { status: 400 }
        )
      }
    }

    if (broadcastType === 5) {
      if (!hasStartTime) {
        return NextResponse.json(
          {
            error: 'Необходимо указать время начала для данного типа вещания',
          },
          { status: 400 }
        )
      }
    }

    const forwardedBody: Record<string, any> = {
      ...body,
      parameters: normalizedParameters,
    }

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
          error: 'Ошибка при создании AD заказа',
          detail: responseData,
        },
        { status: apiResponse.status }
      )
    }

    return NextResponse.json(responseData, { status: apiResponse.status })
  } catch (error: any) {
    console.error('Error in /api/adorders POST handler:', error)

    if (error.message === 'Session expired') {
      return NextResponse.json(
        { detail: 'Нужно авторизоваться' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Ошибка при создании AD заказа' },
      { status: 500 }
    )
  }
}
