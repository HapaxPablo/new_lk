import { useEffect, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'

export function useSafeMediaQuery(query: string): boolean | undefined {
  const isClient = typeof window !== 'undefined'
  const mediaQueryResult = useMediaQuery(query)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Пока компонент не смонтирован, возвращаем undefined
  if (!isClient || !mounted) return undefined

  return mediaQueryResult
}
