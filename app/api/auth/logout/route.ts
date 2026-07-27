import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value

  try {
    const apiUrl = `${process.env.API_1C_URL}/auth/logout/`

    // Make API call to 1C (non-blocking - we always want to clear cookie)
    if (token) {
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': request.headers.get('user-agent') || '',
          Cookie: `access_token=${token}`,
        },
      }).catch(console.error) // Log error but don't fail
    }
  } catch (error) {
    console.error('Logout API error:', error)
    // Continue to clear cookie even if API fails
  }

  // Always clear cookie, regardless of API result
  const res = NextResponse.json({ success: true })
  res.cookies.set({
    name: 'access_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return res
}
