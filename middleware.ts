// import { NextResponse, type NextRequest } from 'next/server'
// import { getMiddlewareSession } from '@/lib/session'

// export async function middleware(request: NextRequest) {
//   const { session, response } = await getMiddlewareSession(request)
//   const { pathname } = request.nextUrl

//   // Защищенные маршруты
//   const protectedRoutes = ['/dashboard', '/nomenclatures', '/settings']
//   const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

//   // Маршруты аутентификации
//   const authRoutes = ['/login', '/register']
//   const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

//   if (isProtected && !session.user) {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   if (isAuthRoute && session.user) {
//     return NextResponse.redirect(new URL('/nomenclatures', request.url))
//   }

//   // Для API запросов к 1С
//   if (pathname.startsWith('/api/1c')) {
//     if (!session.user?.xrmcCookie) {
//       return NextResponse.json(
//         { message: 'Authentication required' },
//         { status: 401 }
//       )
//     }

//     // Клонируем headers из оригинального response
//     const newHeaders = new Headers(response.headers)
//     newHeaders.set('X-XRMC-Cookie', session.user.xrmcCookie)

//     return NextResponse.next({
//       request: {
//         headers: newHeaders
//       }
//     })
//   }

//   return response
// }

// export const config = {
//   matcher: [
//     '/((?!api/1c|_next/static|_next/image|favicon.ico).*)',
//   ]
// }
import { getMiddlewareSession } from '@/lib/session'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { session, response } = await getMiddlewareSession(request)
  const { pathname } = request.nextUrl

  // Защищенные маршруты
  const protectedRoutes = ['/nomenclatures']
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Маршруты аутентификации
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (isProtected && !session.user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && session.user) {
    return NextResponse.redirect(new URL('/nomenclatures', request.url))
  }

  // Для API запросов к 1С
  const api1cUrl = new URL(process.env.API_1C_URL!)

  // Проверяем, что запрос идет к нашему API 1С
  const is1cApiRequest =
    request.nextUrl.host === api1cUrl.host &&
    request.nextUrl.pathname.startsWith(api1cUrl.pathname)

  if (is1cApiRequest) {
    if (!session.user?.xrmcCookie) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Клонируем headers из оригинального response
    const newHeaders = new Headers(response.headers)
    newHeaders.set('X-XRMC-Cookie', session.user.xrmcCookie)

    return NextResponse.next({
      request: {
        headers: newHeaders,
      },
      headers: newHeaders,
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
