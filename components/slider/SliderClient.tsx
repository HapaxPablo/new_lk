'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { ChevronUp, ChevronDown } from 'lucide-react'
import styles from './Slider.module.scss'
import LoaderSkeleton from '../ui/loader/LoaderSkeleton'
import { IImage } from '@/types/nomenclature'
import { Button } from '../ui/button/Button'

interface ISliderProps {
  autoPlay: boolean
  autoPlayTime: number
  width?: string | number
  height?: string | number
  images?: IImage[]
}

const THUMBNAIL_SIZE = 80
const MOBILE_THUMBNAIL_SIZE = 60
const MAX_VISIBLE_THUMBNAILS = 5

const SliderClient = function ({
  width = '100%',
  height = '100%',
  autoPlay,
  autoPlayTime,
  images = [],
}: ISliderProps) {
  const [items, setItems] = useState<IImage[]>(images)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [thumbnailOffset, setThumbnailOffset] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const thumbnailsListRef = useRef<HTMLDivElement>(null)
  const mainImageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (thumbnailsListRef.current) {
      const activeThumbIndex = selectedIndex - thumbnailOffset
      const activeThumb = thumbnailsListRef.current.children[
        activeThumbIndex
      ] as HTMLElement
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [selectedIndex, thumbnailOffset])

  const minSwipeDistance = 50

  const visibleThumbnails = items.slice(
    thumbnailOffset,
    thumbnailOffset + MAX_VISIBLE_THUMBNAILS
  )
  const hasTopArrow = thumbnailOffset > 0
  const hasBottomArrow = thumbnailOffset + MAX_VISIBLE_THUMBNAILS < items.length
  const hasMultipleImages = items.length > 1

  const goToSlide = useCallback(
    (number: number) => {
      if (items.length === 0) return

      let newIndex = number
      while (newIndex < 0) {
        newIndex += items.length
      }
      newIndex = newIndex % items.length

      setSelectedIndex(newIndex)
    },
    [items.length]
  )

  useEffect(() => {
    const maxOffset = Math.max(0, items.length - MAX_VISIBLE_THUMBNAILS)

    if (selectedIndex >= thumbnailOffset + MAX_VISIBLE_THUMBNAILS) {
      setThumbnailOffset(
        Math.min(maxOffset, selectedIndex - MAX_VISIBLE_THUMBNAILS + 1)
      )
    } else if (selectedIndex < thumbnailOffset) {
      setThumbnailOffset(selectedIndex)
    }
  }, [selectedIndex, items.length, thumbnailOffset])

  const goToNextSlide = useCallback(() => {
    goToSlide(selectedIndex + 1)
  }, [selectedIndex, goToSlide])

  const goToPrevSlide = useCallback(() => {
    goToSlide(selectedIndex - 1)
  }, [selectedIndex, goToSlide])

  const handleThumbnailClick = (index: number) => {
    goToSlide(index)
  }

  const handleThumbnailScroll = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      goToPrevSlide()
    } else if (direction === 'down') {
      goToNextSlide()
    }
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsSwiping(true)
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    setDragStartX(x)
    setDragOffset(0)
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isSwiping || dragStartX === null) return

    e.preventDefault()
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    const offset = dragStartX - x
    setDragOffset(offset)
  }

  const handleDragEnd = useCallback(() => {
    setIsSwiping(false)

    if (Math.abs(dragOffset) > minSwipeDistance) {
      if (dragOffset > 0) {
        goToSlide(selectedIndex + 1)
      } else {
        goToSlide(selectedIndex - 1)
      }
    }

    setDragStartX(null)
    setDragOffset(0)
  }, [dragOffset, selectedIndex, goToSlide])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    handleDragStart(e)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX)
    handleDragMove(e)
  }

  const handleTouchEnd = useCallback(() => {
    if (!touchStartX || !touchEndX) return

    const distance = touchStartX - touchEndX
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToSlide(selectedIndex + 1)
    } else if (isRightSwipe) {
      goToSlide(selectedIndex - 1)
    }

    setTouchStartX(null)
    setTouchEndX(null)
    handleDragEnd()
  }, [touchStartX, touchEndX, selectedIndex, goToSlide, handleDragEnd])

  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return
    handleDragMove(e)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  const handleMouseLeave = () => {
    if (isSwiping) {
      handleDragEnd()
    }
  }

  useEffect(() => {
    if (images) {
      setItems(images)
      setSelectedIndex(0)
      setThumbnailOffset(0)
    }
  }, [images])

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return

    const interval = setInterval(() => {
      if (!isSwiping) {
        goToSlide(selectedIndex + 1)
      }
    }, autoPlayTime)

    return () => {
      clearInterval(interval)
    }
  }, [
    items.length,
    autoPlay,
    autoPlayTime,
    goToSlide,
    selectedIndex,
    isSwiping,
  ])

  if (items.length === 0) {
    return <LoaderSkeleton />
  }

  const currentImage = items[selectedIndex]

  return (
    <div
      ref={mainImageRef}
      style={{ width, height }}
      className={styles.gallery}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.thumbnails}>
        {hasMultipleImages && (
          <div className="w-fit sm:w-full h-full sm:h-fit">
            <Button
              variant="default"
              className={`${styles.arrow_up} w-full h-full`}
              onClick={() => handleThumbnailScroll('up')}
              aria-label="Предыдущее изображение"
            >
              <ChevronUp className={styles.rotate} />
            </Button>
          </div>
        )}

        {/* Always render thumbnails - they will scroll via offset */}
        <div className={styles.thumbnails__list} ref={thumbnailsListRef}>
          {visibleThumbnails.map((image, idx) => {
            const actualIndex = thumbnailOffset + idx
            const isActive = selectedIndex === actualIndex
            return (
              <div
                key={actualIndex}
                className={`${styles.thumbnails_img} ${
                  isActive ? styles.thumbnails_img_active : ''
                }`}
                onClick={() => handleThumbnailClick(actualIndex)}
              >
                {image.source && (
                  <Image
                    src={image.source}
                    alt={`Миниатюра ${actualIndex + 1}`}
                    fill
                    sizes="80px"
                  />
                )}
              </div>
            )
          })}
        </div>

        {hasMultipleImages && (
          <div className="w-fit sm:w-full h-full sm:h-fit">
            <Button
              variant="default"
              className={`${styles.arrow_down}`}
              onClick={() => handleThumbnailScroll('down')}
              aria-label="Следующее изображение"
            >
              <ChevronDown className={styles.rotate} />
            </Button>
          </div>
        )}
      </div>

      <div className={styles.main}>
        {currentImage.source ? (
          <div
            className={styles.main__image}
            style={{
              transform: isSwiping
                ? `translateX(${dragOffset}px)`
                : 'translateX(0)',
              transition: isSwiping ? 'none' : 'transform 0.3s ease',
            }}
          >
            <Image
              src={currentImage.source}
              alt={`Изображение ${selectedIndex + 1}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Image
              src="/og-logo.jpg"
              alt="Логотип"
              width={200}
              height={100}
              className="object-contain"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default SliderClient
