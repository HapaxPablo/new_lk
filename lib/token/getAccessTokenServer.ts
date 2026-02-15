'use server'

import { cookies } from 'next/headers'
import { headers } from 'next/headers'

export async function getServerAccessToken() {
  try {
    const cookieStore = await cookies()
    const headersList = await headers()

    // Пробуем получить токен из куки
    let access_token = cookieStore.get('access_token')?.value
    console.log(
      '[getServerAccessToken] from cookies():',
      access_token ? 'present' : 'missing'
    )

    // Если токена нет в куки, пробуем получить из заголовка Authorization
    if (!access_token) {
      const authHeader = headersList.get('Authorization')
      console.log(
        '[getServerAccessToken] Authorization header:',
        authHeader ? 'present' : 'missing'
      )
      if (authHeader?.startsWith('access_token ')) {
        access_token = authHeader.substring(12) // длина "access_token " = 12
      }
    }

    // Also try x-access-token header
    if (!access_token) {
      const xAccessToken = headersList.get('x-access-token')
      console.log(
        '[getServerAccessToken] x-access-token header:',
        xAccessToken ? 'present' : 'missing'
      )
      if (xAccessToken) {
        access_token = xAccessToken
      }
    }

    console.log(
      '[getServerAccessToken] final result:',
      access_token ? 'present' : 'missing'
    )
    return access_token || null
  } catch (error) {
    console.error('Error getting access token:', error)
    return null
  }
}
