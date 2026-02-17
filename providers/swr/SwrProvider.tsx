'use client'

import { SWRConfig } from 'swr'
import { useHttpClient } from '@/hooks/useHttpClient'

export function SWRProvider({ children }: { children: React.ReactNode }) {
  const { client } = useHttpClient()

  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => client.get(url),
        revalidateOnFocus: false,
        dedupingInterval: 60_000,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  )
}
