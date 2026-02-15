import { getMiddlewareSession } from '@/lib/session'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { session, response } = await getMiddlewareSession(request)
  const { pathname } = request.nextUrl

  // Check all cookies from request
  const allCookies = request.cookies.getAll()
  console.log(
    '[Middleware] All cookies from request:',
    allCookies.map((c) => c.name)
  )

  console.log('[Middleware] Request cookies:', request.cookies.getAll())
  console.log('[Middleware] Request headers:', {
    cookie: request.headers.get('cookie'),
    authorization: request.headers.get('authorization'),
  })

  // Проверка SSL
  console.log('[Middleware] Protocol:', request.nextUrl.protocol)
  console.log('[Middleware] Is HTTPS:', request.nextUrl.protocol === 'https:')
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

  // Получаем токен из куки
  const token = request.cookies.get('access_token')?.value

  // Устанавливаем токен в заголовки для передачи в API routes
  if (token) {
    // Для Authorization заголовка (формат "access_token <token>")
    res.headers.set('Authorization', `access_token ${token}`)
    // Также устанавливаем x-access-token для совместимости
    res.headers.set('x-access-token', token)

    // Также нужно модифицировать заголовки запроса
    request.headers.set('Authorization', `access_token ${token}`)
    request.headers.set('x-access-token', token)
  }

  console.log('[Middleware] Token from cookie:', token ? 'present' : 'missing')
  console.log(
    '[Middleware] Setting x-access-token header:',
    token ? 'yes' : 'no'
  )

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
