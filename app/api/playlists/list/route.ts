import { getPlaylistsList } from '@/app/(main)/orders/playlists/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const page = Number(params.get('page') ?? 1)
    const limit = Number(params.get('limit') ?? 20)
    const name = params.get('name') ?? ''

    const data = await getPlaylistsList({ page, limit, name })
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in /api/playlists/list:', error)
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error while loading playlists'
    return NextResponse.json(
      { error: 'Internal Server Error', message },
      { status: 500 }
    )
  }
}
