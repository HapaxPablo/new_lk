import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const backendUrl =
      process.env.API_1C_URL ||
      process.env.NEXT_PUBLIC_API_1C_URL ||
      'http://192.168.0.8:8000/'
    const url = new URL('api/cities/popular/', backendUrl)

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
    })

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }

    return NextResponse.json(await response.json(), {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Error in popular cities API route:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
