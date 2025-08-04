import { getIronSession, IronSessionData } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: string
      name: string
      email: string
      xrmcCookie?: string
    }
  }
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters', // В продакшене использовать env переменную
  cookieName: '1c_auth_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7 // 1 неделя
  }
}

// Универсальная функция для получения сессии
export async function getSession() {
  if (typeof window === 'undefined') {
    // Серверный код
    try {
      const cookieStore = await cookies()
      return await getIronSession<IronSessionData>(await cookieStore, sessionOptions)
    } catch (e) {
      console.error('Failed to get session from cookies:', e)
      // Fallback для случаев, когда cookies() не доступен (например, в middleware)
      const req = new NextRequest('http://localhost')
      const res = new NextResponse()
      return await getIronSession<IronSessionData>(req, res, sessionOptions)
    }
  } else {
    // Клиентский код
    return getClientSession()
  }
}

// Клиентская функция
export async function getClientSession() {
  if (typeof window === 'undefined') {
    throw new Error('getClientSession should only be called on the client')
  }

  try {
    const response = await fetch('/api/auth/session', {
      cache: 'no-store',
      credentials: 'include'
    })

    if (!response.ok) throw new Error('Failed to fetch session')
    return await response.json()
  } catch (error) {
    console.error('Client session error:', error)
    return { user: null }
  }
}

// Для Server Components и Server Actions
export async function getServerSession() {
  const cookieStore = await cookies()
  return await getIronSession<IronSessionData>(await cookieStore, sessionOptions)
}

// Для Route Handlers (app router)
export async function getRouteSession(req: NextRequest, res: NextResponse) {
  return await getIronSession<IronSessionData>(req, res, sessionOptions)
}

// Для middleware
export async function getMiddlewareSession(req: NextRequest) {
  const res = new NextResponse()
  const session = await getIronSession<IronSessionData>(req, res, sessionOptions)
  return { session, response: res }
}