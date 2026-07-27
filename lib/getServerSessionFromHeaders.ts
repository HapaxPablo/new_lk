import { cookies } from 'next/headers'
import { headers as getHeaders } from 'next/headers'

type SessionUser = {
  access_token: string
  user_id?: string
}

type ServerSession = {
  user: SessionUser | null
}

export async function getServerSessionFromHeaders(): Promise<ServerSession> {
  const cookieStore = await cookies()
  const headersList = getHeaders()

  // Получаем токен из куки
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return {
      user: null,
    }
  }

  try {
    // Декодируем JWT токен
    const [, payload] = token.split('.')
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString())

    return {
      user: {
        access_token: token,
        user_id: decodedPayload.user_id,
      },
    }
  } catch (error) {
    console.error('Error parsing session token:', error)
    return {
      user: null,
    }
  }
}
