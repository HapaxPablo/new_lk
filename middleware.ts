import { getMiddlewareSession } from '@/lib/session'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { session, response } = await getMiddlewareSession(request)
  const { pathname } = request.nextUrl

  // ✅ Маршруты авторизации
  const authRoutes = ['/login', '/registration']
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  // перенаправляем на номенклатуру при входе по корню
  if (request.nextUrl.pathname === '/') {
    // Создаем новый URL с сохранением query параметров
    const newUrl = new URL('/nomenclatures', request.url)
    newUrl.search = request.nextUrl.search // Сохраняем query параметры

    return NextResponse.redirect(newUrl)
  }
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

  // Передаём xrmcCookie если есть
  if (session.user?.xrmcCookie) {
    res.headers.set('X-XRMC-Cookie', session.user.xrmcCookie)
  }

  // Также передаём токен из куки в заголовки для 1C API (в формате как в Swagger: "access_token <token>")
  const token = request.cookies.get('access_token')?.value
  if (token) {
    res.headers.set('Authorization', `access_token ${token}`)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - proxy-api (API proxy to 1C)
     */
    '/((?!_next/static|_next/image|favicon.ico|proxy-api).*)',
  ],
}
