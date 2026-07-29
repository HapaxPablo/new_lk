'use client'
import { useEffect, useRef, type RefObject } from 'react'

interface Props {
  containerRef: RefObject<HTMLElement | null>
  onLoadMore: () => void
  hasMore: boolean
  rootMargin?: string
}

export function InfiniteScrollSentinel({
  containerRef,
  onLoadMore,
  hasMore,
  rootMargin = '200px',
}: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    const container = containerRef.current
    if (!sentinel || !container || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onLoadMore(),
      { root: container, rootMargin }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [containerRef, onLoadMore, hasMore, rootMargin])

  return <div ref={sentinelRef} className="h-px" />
}
