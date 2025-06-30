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

const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD!,
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
  // Для серверных компонентов и серверных действий
  if (typeof window === 'undefined') {
    try {
      // Попробуем получить через cookies() (для серверных компонентов)
      const cookieStore = cookies()
      return getIronSession<IronSessionData>(await cookieStore, sessionOptions)
    } catch (e) {
      return getIronSession<IronSessionData>(
        new NextRequest('http://localhost'),
        new NextResponse(),
        sessionOptions
      )
    }
  } else {
    // клиентская логика
    return getClientSession()
  }
}

// Клиентская функцию
export async function getClientSession() {
  if (typeof window === 'undefined') {
    throw new Error('getClientSession should only be called on the client')
  }

  try {
    const response = await fetch('/api/auth/session', {
      cache: 'no-store',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch session')
    }

    return await response.json()
  } catch (error) {
    console.error('Client session error:', error)
    return { user: null }
  }
}

// Для Server Components и Server Actions
export async function getServerSession() {
  const cookieStore = cookies()
  return getIronSession<IronSessionData>(await cookieStore, sessionOptions)
}

// Для Route Handlers (app router)
export async function getRouteSession(request: NextRequest, response: NextResponse) {
  return getIronSession<IronSessionData>(request, response, sessionOptions)
}

// Для middleware
export async function getMiddlewareSession(request: NextRequest) {
  const response = new NextResponse()
  const session = await getIronSession<IronSessionData>(
    request,
    response,
    sessionOptions
  )
  await session.save()
  return { session, response }
}