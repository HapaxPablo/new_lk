import { getMiddlewareSession } from '@/lib/session'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { session, response } = await getMiddlewareSession(request)
  const { pathname } = request.nextUrl

  // ✅ Маршруты авторизации
  const authRoutes = ['/login', '/registration']
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (isAuthRoute && session.user) {
    return NextResponse.redirect(new URL('/nomenclatures', request.url))
  }

  // ✅ Защита API-запросов к 1С
  const api1cUrl = new URL(process.env.API_1C_URL!)
  const is1cApiRequest =
    request.nextUrl.host === api1cUrl.host &&
    request.nextUrl.pathname.startsWith(api1cUrl.pathname)

  // if (is1cApiRequest) {
  //   if (!session.user?.xrmcCookie) {
  //     return NextResponse.json(
  //       { message: 'Authentication required' },
  //       { status: 401 }
  //     )
  //   }

  //   const newHeaders = new Headers(request.headers)
  //   newHeaders.set('X-XRMC-Cookie', session.user.xrmcCookie)

  //   return NextResponse.next({
  //     request: {
  //       headers: newHeaders,
  //     },
  //   })
  // }

  // ✅ В любом случае подставляем токен для внутренних API/SSR
  const res = NextResponse.next()
  if (session.user?.xrmcCookie) {
    res.headers.set('X-XRMC-Cookie', session.user.xrmcCookie)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
