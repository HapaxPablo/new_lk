import { getFilesList } from '@/app/(main)/orders/files/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams

    const data = await getFilesList({
      page: Number(params.get('page') ?? 1),
      limit: Number(params.get('limit') ?? 20),
      name: params.get('name') ?? '',
      search: params.get('search') ?? '',
      file_type: params.get('file_type') ?? '',
      tags: params.getAll('tags'),
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in /api/files/list:', error)

    // Важно: возвращаем понятную ошибку вместо 404
    if (error instanceof Error && error.message === 'Session expired') {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Session expired' },
        { status: 401 }
      )
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal Server Error', message: errorMessage },
      { status: 500 }
    )
  }
}
