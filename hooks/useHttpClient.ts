'use client'

import { HttpClient1C } from '@/lib/http-client/httpClient'
import { getClientAccessToken } from '@/lib/token/getAccessTokenClient'
import { useAuth } from '@/providers/auth-provider/AuthProvider'
import { useMemo } from 'react'

export function useHttpClient() {
  const { logout, isAuthenticated } = useAuth()
  const token = getClientAccessToken()

  return useMemo(() => {
    return {
      client: HttpClient1C.client(),
      isAuthenticated,
    }
  }, [token, logout, isAuthenticated])
}
