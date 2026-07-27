import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  triggerOnce?: boolean
  rootMargin?: string
  threshold?: number
}

export function useInView(options: UseInViewOptions = {}) {
  const { triggerOnce = false, rootMargin = '0px', threshold = 0 } = options
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (triggerOnce) {
            observer.unobserve(el)
          }
        } else if (!triggerOnce) {
          setInView(false)
        }
      },
      { rootMargin, threshold }
    )

    observer.observe(el)

    return () => {
      observer.unobserve(el)
    }
  }, [triggerOnce, rootMargin, threshold])

  return { ref, inView }
}
