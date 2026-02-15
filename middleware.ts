import { getMiddlewareSession } from '@/lib/session'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { session, response } = await getMiddlewareSession(request)
  const { pathname } = request.nextUrl
  console.log('Request cookies:', request.cookies.getAll())
  console.log('Request headers:', {
    cookie: request.headers.get('cookie'),
    authorization: request.headers.get('authorization'),
  })

  // Проверка SSL
  console.log('Protocol:', request.nextUrl.protocol)
  console.log('Is HTTPS:', request.nextUrl.protocol === 'https:')
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

  // Forward x-access-token header from client request to external API
  // This is needed because cookies for domain test.lk.krasrm.com
  // are not sent when making requests to different domain api1.krasrm.com
  const clientToken = request.headers.get('x-access-token')
  console.log(
    '[Middleware] x-access-token from client:',
    clientToken ? 'present' : 'missing'
  )
  if (clientToken) {
    res.headers.set('x-access-token', clientToken)
    res.headers.set('Authorization', `access_token ${clientToken}`)
    console.log('[Middleware] Set headers for response')
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
