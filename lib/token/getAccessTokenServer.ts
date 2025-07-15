'use server'

import { cookies } from 'next/headers'

export async function getServerAccessToken() {
  const cookieStore = await cookies()
  const xrmcCookie = cookieStore.get('xrmcCookie')?.value
  return xrmcCookie || null
}
