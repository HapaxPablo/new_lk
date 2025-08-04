'use client'

import { ArrowBigUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import styles from './ScrollButton.module.scss'

const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const scrollToTop = () => {
    const contentElement = document.querySelector('.content')
    if (contentElement) {
      contentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    const contentElement = document.querySelector('.content')
    if (!contentElement) return

    const toggleVisibility = () => {
      setIsVisible(contentElement.scrollTop > 300)
    }

    contentElement.addEventListener('scroll', toggleVisibility)
    return () => contentElement.removeEventListener('scroll', toggleVisibility)
  }, [])

  if (!isVisible) return null

  return (
    <div className={styles.buttonContainer}>
      <button
        onClick={scrollToTop}
        className={styles.scrollToTop}
        aria-label="Перейти в начало страницы"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <ArrowBigUp size={36} style={{ margin: '8px' }} />
      </button>

      {showTooltip && <div className={styles.tooltip}>Наверх</div>}
    </div>
  )
}

export default ScrollButton
