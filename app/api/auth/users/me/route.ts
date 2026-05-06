import { NextRequest, NextResponse } from 'next/server'
import { HttpClient1C } from '@/lib/http-client'

export async function GET(request: NextRequest) {
  try {
    const me = await HttpClient1C.server(request).get<{ id: string }>(
      'auth/users/me/'
    )

    const userId = me.id
    if (!userId) {
      return NextResponse.json({ error: 'No user id' }, { status: 401 })
    }

    const user = await HttpClient1C.server(request).get(`api/users/${userId}/`)

    const res = NextResponse.json(user)

    res.cookies.set({
      name: 'user_id',
      value: userId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
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
