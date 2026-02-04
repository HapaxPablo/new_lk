'use client'

import { HttpClient1C } from '@/lib/http-client/httpClient'
import { getClientAccessToken } from '@/lib/token/getAccessTokenClient'
import { useAuth } from '@/providers/auth-provider/AuthProvider'
import { useMemo } from 'react'

export function useHttpClient() {
  const { logout } = useAuth()
  const token = getClientAccessToken()

  return useMemo(() => {
    return HttpClient1C.client(token, logout)
  }, [token, logout])
}
