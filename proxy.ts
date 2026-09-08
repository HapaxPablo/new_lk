// import { redirectFromWwwToApex } from '@/lib/get-request-host'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // const wwwRedirect = redirectFromWwwToApex(request)
  // if (wwwRedirect) {
  //   return wwwRedirect
  // }
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value
  const isAuthenticated = Boolean(token)
  const ua = request.headers.get('user-agent') ?? ''
  const isMobile = /mobile|android|iphone/i.test(ua)

  if (pathname.startsWith('/catalog/')) {
    // Извлекаем slug: всё после '/catalog/'
    let slug = pathname.slice('/catalog/'.length)
    // Удаляем возможный конечный слеш (старые URL часто оканчивались на '/')
    if (slug.endsWith('/')) {
      slug = slug.slice(0, -1)
    }
    if (slug) {
      // Постоянный редирект 301 (permanent)
      const newUrl = new URL(`/nomenclatures/${slug}`, request.url)
      return NextResponse.redirect(newUrl, 301)
    }
    // Если slug пустой (например, /catalog/), редиректим на общий каталог
    return NextResponse.redirect(new URL('/nomenclatures', request.url), 301)
  }
  // ✅ Маршруты авторизации
  const authRoutes = ['/login', '/registration']
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  // перенаправляем на номенклатуру при входе по корню
  if (request.nextUrl.pathname === '/') {
    // Создаем новый URL с сохранением query параметров
    const newUrl = new URL('/nomenclatures', request.url)
    newUrl.search = request.nextUrl.search // Сохраняем query параметры

    return NextResponse.redirect(newUrl, 301)
  }
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/nomenclatures', request.url))
  }

  if (request.nextUrl.pathname === '/places' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/nomenclatures', request.url))
  }

  // ✅ В любом случае подставляем токен для внутренних API/SSR
  const res = NextResponse.next()

  // Также передаём токен из куки в заголовки для 1C API (в формате как в Swagger: "access_token <token>")
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
