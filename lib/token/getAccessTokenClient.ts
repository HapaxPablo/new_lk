export function getClientAccessToken() {
  if (typeof window === 'undefined') return null

  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1] || null
  )
}
