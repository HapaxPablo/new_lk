/**
 * URL стиля/тайлов карты задаются через NEXT_PUBLIC_* переменные и вшиваются
 * в клиентский бандл на этапе сборки. Если там указан http://, а сайт работает
 * по https, браузер блокирует запрос (CSP connect-src / mixed content).
 * Поднимаем http до https под протокол страницы.
 */
export function secureMapUrl(url?: string): string | undefined {
  if (!url) return undefined
  if (typeof window === 'undefined') return url
  if (window.location.protocol === 'https:' && url.startsWith('http://')) {
    return url.replace(/^http:\/\//, 'https://')
  }
  return url
}
