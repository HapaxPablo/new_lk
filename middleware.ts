// import { redirectFromWwwToApex } from '@/lib/get-request-host'
import { getMiddlewareSession } from '@/lib/session'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // const wwwRedirect = redirectFromWwwToApex(request)
  // if (wwwRedirect) {
  //   return wwwRedirect
  // }
  const { session, response } = await getMiddlewareSession(request)

  const { pathname } = request.nextUrl
  const ua = request.headers.get('user-agent') ?? ''
  const isMobile = /mobile|android|iphone/i.test(ua)

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

  if (request.nextUrl.pathname === '/places' && !session.user) {
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

  if (isMobile) {
    res.headers.set('x-is-mobile', isMobile ? '1' : '0')
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|proxy-api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
