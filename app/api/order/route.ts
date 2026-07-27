import { NextRequest, NextResponse } from 'next/server'

interface PlacementOrderPayload {
  duration: number
  start_date: string
  end_date: string
  all_days: boolean
  days_of_week: string[]
  nomenclature_ids: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: PlacementOrderPayload = await request.json()

    const {
      duration,
      start_date,
      end_date,
      all_days,
      days_of_week,
      nomenclature_ids,
    } = body

    if (!duration || duration < 1) {
      return NextResponse.json(
        { duration: ['Укажите кол-во дней (минимум 1)'] },
        { status: 400 }
      )
    }

    if (!all_days && (!days_of_week || days_of_week.length === 0)) {
      return NextResponse.json(
        { days_of_week: ['Укажите дни недели, если all_days = false'] },
        { status: 400 }
      )
    }

    if (!nomenclature_ids || nomenclature_ids.length === 0) {
      return NextResponse.json(
        { nomenclature_ids: ['Выберите хотя бы одно место размещения'] },
        { status: 400 }
      )
    }

    const data = await fetch(`${process.env.API_1C_URL}api/placement-orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `access_token ${request.cookies.get('access_token')?.value || ''}`,
        Cookie: `access_token=${request.cookies.get('access_token')?.value || ''}`,
        'User-Agent': request.headers.get('user-agent') || '',
      },
      body: JSON.stringify({
        duration,
        start_date,
        end_date,
        all_days,
        days_of_week,
        nomenclature_ids,
      }),
    })

    if (!data.ok) {
      const errorData = await data.json()
      console.error('Error response from 1C API:', errorData)
      return NextResponse.json(
        { detail: 'Ошибка при создании заказа', error: errorData },
        { status: data.status }
      )
    }

    return NextResponse.json(
      { detail: 'Заказ успешно создан' },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.message === 'Session expired') {
      return NextResponse.json(
        { detail: 'Нужно авторизоваться' },
        { status: 401 }
      )
    }

    console.error('Error in order POST handler:', error)
    console.error('PlacementOrder create error:', error.message)

    return NextResponse.json(
      { detail: 'Ошибка при создании заказа' },
      { status: 500 }
    )
  }
}
