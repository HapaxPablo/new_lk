import { NextRequest } from 'next/server'

type SessionUser = {
  xrmcCookie: string
}

type ServerSession = {
  user: SessionUser
  token: string
} | null

export function getServerSessionFromHeaders(
  request: NextRequest
): ServerSession {
  const token =
    request.headers.get('X-XRMC-Cookie') ??
    request.cookies.get('xrmcCookie')?.value

  if (!token) return null

  return {
    token,
    user: {
      xrmcCookie: token,
    },
  }
}
