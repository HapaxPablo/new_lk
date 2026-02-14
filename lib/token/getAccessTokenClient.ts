export function getClientAccessToken() {
  const token =
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1] || null

  console.log('access_token client', token)
  return token
}
