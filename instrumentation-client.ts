const AUTH_PAGE_PATHS = ['/login', '/registration', '/reset-password']
const PUBLIC_AUTH_API_PATHS = [
  '/api/auth/check',
  '/api/auth/login',
  '/api/auth/registration',
  '/api/auth/reset-password',
]

type WindowWithUnauthorizedRedirect = typeof window & {
  __unauthorizedRedirectInstalled?: boolean
}

function pathMatches(pathname: string, paths: string[]) {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

function getRequestUrl(input: Parameters<typeof window.fetch>[0]) {
  const value =
    typeof input === 'string' || input instanceof URL ? input : input.url

  return new URL(value, window.location.origin)
}

const authWindow = window as WindowWithUnauthorizedRedirect

if (!authWindow.__unauthorizedRedirectInstalled) {
  const originalFetch = window.fetch.bind(window)
  let isRedirecting = false

  window.fetch = async (...args) => {
    const response = await originalFetch(...args)

    if (response.status !== 401 || isRedirecting) return response

    try {
      const requestUrl = getRequestUrl(args[0])
      const isSameOrigin = requestUrl.origin === window.location.origin
      const isAuthPage = pathMatches(window.location.pathname, AUTH_PAGE_PATHS)
      const isPublicAuthRequest = pathMatches(
        requestUrl.pathname,
        PUBLIC_AUTH_API_PATHS
      )

      if (isSameOrigin && !isAuthPage && !isPublicAuthRequest) {
        isRedirecting = true
        window.location.replace('/login')
      }
    } catch (error) {
      console.error('Не удалось обработать ответ 401', error)
    }

    return response
  }

  authWindow.__unauthorizedRedirectInstalled = true
}
