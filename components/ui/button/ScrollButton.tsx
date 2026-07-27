'use client'

import { ArrowBigUp } from 'lucide-react'
import { useEffect, useState, useRef, RefObject } from 'react'
import styles from './ScrollButton.module.scss'

interface ScrollButtonProps {
  scrollContainerRef: RefObject<HTMLElement | null>
  showAfterScroll?: number
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const ScrollButton = ({
  scrollContainerRef,
  showAfterScroll = 300,
  position = 'bottom-right',
  size = 'md',
  className = '',
}: ScrollButtonProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop } = container
      setIsVisible(scrollTop > showAfterScroll)
    }

    container.addEventListener('scroll', handleScroll)

    handleScroll()

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [scrollContainerRef, showAfterScroll])

  if (!isVisible) return null

  const positionClasses = {
    'bottom-right': styles.bottomRight,
    'bottom-left': styles.bottomLeft,
    'top-right': styles.topRight,
    'top-left': styles.topLeft,
  }

  const sizeClasses = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  }

  return (
    <div
      ref={buttonRef}
      className={`${styles.buttonWrapper} ${positionClasses[position]} ${className}`}
    >
      <div className={styles.buttonContainer}>
        <button
          onClick={scrollToTop}
          className={`${styles.scrollToTop} ${sizeClasses[size]}`}
          aria-label="Перейти в начало страницы"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <ArrowBigUp className={styles.icon} />
        </button>

        {showTooltip && <div className={styles.tooltip}>Наверх</div>}
      </div>
    </div>
  )
}

export default ScrollButton
