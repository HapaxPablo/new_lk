'use client'

import { createContext, useEffect, useState, useCallback, useRef } from 'react'
import styles from './Slider.module.scss'
import Arrows from './components/Controls/Arrows'
import SlidesList from './components/SlidesList'
import Dots from './components/Controls/Dots'
import LoaderSkeleton from '../ui/loader/LoaderSkeleton'
import { IImage } from '@/types/nomenclature'
import { SliderContext } from './SliderContext'

interface ISliderProps {
  autoPlay: boolean
  autoPlayTime: number
  width?: string | number
  height?: string | number
  images?: IImage[]
}

interface ISliderContext {
  goToSlide: (number: number) => void
  changeSlide: (direction?: number) => void
  slidesCount: number
  slideNumber: number
  images: IImage[]
  isFirstSlide: boolean
  isLastSlide: boolean
}

const SliderClient = function ({
  width = '100%',
  height = '100%',
  autoPlay,
  autoPlayTime,
  images = [],
}: ISliderProps) {
  const [items, setItems] = useState<IImage[]>(images)
  const [slide, setSlide] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50
  const isFirstSlide = slide === 0
  const isLastSlide = slide === items.length - 1 || items.length === 0

  const changeSlide = useCallback(
    (direction = 1) => {
      if (items.length === 0) return

      let slideNumber = 0

      if (slide + direction < 0) {
        slideNumber = items.length - 1
      } else {
        slideNumber = (slide + direction) % items.length
      }

      setSlide(slideNumber)
    },
    [slide, items.length]
  )

  const goToSlide = useCallback(
    (number: number) => {
      if (items.length === 0) return
      setSlide(number % items.length)
    },
    [items.length]
  )

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

  const handleDragEnd = () => {
    setIsSwiping(false)
    
    if (Math.abs(dragOffset) > minSwipeDistance) {
      if (dragOffset > 0) {
        changeSlide(1)
      } else {
        changeSlide(-1)
      }
    }
    
    setDragStartX(null)
    setDragOffset(0)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    handleDragStart(e)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX)
    handleDragMove(e)
  }

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    
    const distance = touchStartX - touchEndX
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      changeSlide(1)
    } else if (isRightSwipe) {
      changeSlide(-1)
    }
    
    setTouchStartX(null)
    setTouchEndX(null)
    handleDragEnd()
  }

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
    }
  }, [images])

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return

    const interval = setInterval(() => {
      if (!isSwiping) {
        changeSlide(1)
      }
    }, autoPlayTime)

    return () => {
      clearInterval(interval)
    }
  }, [items.length, autoPlay, autoPlayTime, changeSlide, slide, isSwiping])

  if (items.length === 0) {
    return <LoaderSkeleton />
  }

  return (
    <div
      ref={sliderRef}
      style={{ width, height }}
      className={`${styles.slider} ${isSwiping ? styles['slider--swiping'] : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <SliderContext.Provider
        value={{
          goToSlide,
          changeSlide,
          slidesCount: items.length,
          slideNumber: slide,
          images: items,
          isFirstSlide,
          isLastSlide,
        }}
      >
        <Arrows />
        <SlidesList dragOffset={dragOffset} />
        <Dots />
      </SliderContext.Provider>
    </div>
  )
}

export default SliderClient