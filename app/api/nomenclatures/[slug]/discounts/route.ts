import { HttpClient1C } from '@/lib/http-client'
import { NextRequest } from 'next/server'

interface Discount {
  id: number
  days_from: number
  days_to: number
  coefficient: string
}

interface DiscountsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Discount[]
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const response = await HttpClient1C.server(request).get<DiscountsResponse>(
      `api/nomenclatures/${encodeURIComponent(slug)}/discounts/`
    )

    return Response.json(response)
  } catch (error: unknown) {
    const status = (error as { status?: number }).status || 500

    return Response.json({ error: 'Не удалось загрузить скидки' }, { status })
  }
}
