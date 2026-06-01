import { NextRequest, NextResponse } from 'next/server'

/**
 * Реальный хост запроса. За reverse proxy nextUrl.hostname часто localhost,
 * поэтому для редиректов используем Host / X-Forwarded-Host.
 */
export function getRequestHost(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-host')
  if (forwarded) {
    return forwarded.split(',')[0].trim().split(':')[0].toLowerCase()
  }

  const host = request.headers.get('host')
  if (host) {
    return host.split(':')[0].toLowerCase()
  }

  return request.nextUrl.hostname.toLowerCase()
}

/** 301 с www.* на версию без www (www.krasrm.com → krasrm.com). */
export function redirectFromWwwToApex(
  request: NextRequest
): NextResponse | null {
  const host = getRequestHost(request)
  if (!host.startsWith('www.')) {
    return null
  }

  const apexHost = host.slice(4)
  if (!apexHost) {
    return null
  }

  const forwardedProto = request.headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim()
  const protocol =
    forwardedProto === 'http' || forwardedProto === 'https'
      ? forwardedProto
      : request.nextUrl.protocol === 'https:'
        ? 'https'
        : 'http'

  const path = `${request.nextUrl.pathname}${request.nextUrl.search}`
  const destination = new URL(path, `${protocol}://${apexHost}`)

  return NextResponse.redirect(destination, 301)
}
