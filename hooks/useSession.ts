/* клиентский хук для авторизации */
'use client'

import { useEffect, useState } from 'react'
import { getClientSession } from '@/lib/session'

export function useSession() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await getClientSession()
        setSession(data)
      } catch (error) {
        console.error('Failed to load session:', error)
        setSession({ user: null })
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [])

  const refresh = async () => {
    const data = await getClientSession()
    setSession(data)
    return data
  }

  return { session, loading, refresh }
}