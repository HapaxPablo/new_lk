import { NextRequest, NextResponse } from 'next/server'

export interface City {
  name: string
  region?: string
  country?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'lat и lng обязательны' },
        { status: 400 }
      )
    }

    // Серверный fetch к Nominatim (CSP/CORS не применяются к серверу)
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'NewLK-App/1.0',
        },
      }
    )

    if (!nominatimResponse.ok) {
      throw new Error(`Nominatim API error: ${nominatimResponse.status}`)
    }

    const data = await nominatimResponse.json()
    const address = data.address
    const city =
      address?.city || address?.town || address?.village || address?.state

    if (!city) {
      throw new Error('Город не найден в ответе API')
    }

    const result: City = {
      name: city,
      region: address?.state,
      country: address?.country,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Reverse geocode error:', error)
    return NextResponse.json(
      { error: 'Ошибка определения города' },
      { status: 500 }
    )
  }
}
