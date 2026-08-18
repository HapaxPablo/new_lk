import { NextRequest, NextResponse } from 'next/server'
import { HttpClient1C } from '@/lib/http-client'

export async function GET(request: NextRequest) {
  try {
    const user = await HttpClient1C.server(request).get('api/users/me/')
    return NextResponse.json(user)
  } catch (error: any) {
    if (error.message === 'Session expired') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = await request.json()
    const user = await HttpClient1C.server(request).patch(
      'api/users/me/',
      payload
    )
    return NextResponse.json(user)
  } catch (error: any) {
    if (error.message === 'Session expired') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
