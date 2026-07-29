import { NextRequest } from 'next/server'
import { withApiErrorHandling } from '@/lib/http-client/errors'

export async function GET(request: NextRequest) {
  return withApiErrorHandling(async () => {
    const { searchParams } = new URL(request.url)

    const search = searchParams.get('search') || searchParams.get('name') || ''
    const code1c = searchParams.get('code1c') || ''
    const isDeleted = searchParams.get('is_deleted') || 'false'
    const limit = searchParams.get('limit') || '50'
    const page = searchParams.get('page') || '1'

    const apiUrl = new URL('https://api1.krasrm.com/api/brands/')

    if (search) {
      apiUrl.searchParams.set('name', search)
    }
    if (code1c) {
      apiUrl.searchParams.set('code1c', code1c)
    }
    if (isDeleted) {
      apiUrl.searchParams.set('is_deleted', isDeleted)
    }
    if (limit) {
      apiUrl.searchParams.set('limit', limit)
    }
    if (page) {
      apiUrl.searchParams.set('page', page)
    }

    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${await response.text()}`)
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })
}
