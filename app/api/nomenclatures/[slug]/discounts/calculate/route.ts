import { HttpClient1C } from '@/lib/http-client'
import { NextRequest } from 'next/server'

interface DiscountCalculation {
  days: number
  coefficient: number
  base_price: number
  final_price: number
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const days = Number(request.nextUrl.searchParams.get('days'))

  if (!Number.isInteger(days) || days < 1) {
    return Response.json(
      { error: 'Количество дней должно быть целым числом не меньше 1' },
      { status: 400 }
    )
  }

  try {
    const { slug } = await params
    const response = await HttpClient1C.server(
      request
    ).get<DiscountCalculation>(
      `api/nomenclatures/${encodeURIComponent(slug)}/discounts/calculate/?days=${days}`
    )

    return Response.json(response)
  } catch (error: unknown) {
    const status = (error as { status?: number }).status || 500

    return Response.json(
      { error: 'Не удалось рассчитать стоимость' },
      { status }
    )
  }
}
