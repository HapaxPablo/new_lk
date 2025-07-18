export function getClientAccessToken() {
  const token =
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('xrmcCookie='))
      ?.split('=')[1] || null

  console.log('xrmcCookie server', token)
  return token
}
