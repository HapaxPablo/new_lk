'use client'

import { createContext, useEffect, useState, useCallback } from 'react'
import styles from './Slider.module.scss'
import Arrows from './components/Controls/Arrows'
import SlidesList from './components/SlidesList'
import Dots from './components/Controls/Dots'
import LoaderSkeleton from '../ui/loader/LoaderSkeleton'
import { IImage } from '@/types/nomenclature'

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

export const SliderContext = createContext<ISliderContext>({} as ISliderContext)

const Slider = function ({
  width = '100%',
  height = '100%',
  autoPlay,
  autoPlayTime,
  images = [],
}: ISliderProps) {
  const [items, setItems] = useState<IImage[]>(images)
  const [slide, setSlide] = useState(0)
  const [touchPosition, setTouchPosition] = useState<number | null>(null)

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

  const handleTouchStart = (e: React.TouchEvent) => {
    const touchDown = e.touches[0].clientX
    setTouchPosition(touchDown)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchPosition === null) {
      return
    }

    const currentPosition = e.touches[0].clientX
    const direction = touchPosition - currentPosition

    if (Math.abs(direction) > 10) {
      changeSlide(direction > 0 ? 1 : -1)
    }

    setTouchPosition(null)
  }

  useEffect(() => {
    if (images) {
      setItems(images)
    }
  }, [images])

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return

    const interval = setInterval(() => {
      changeSlide(1)
    }, autoPlayTime)

    return () => {
      clearInterval(interval)
    }
  }, [items.length, autoPlay, autoPlayTime, changeSlide, slide])

  if (items.length === 0) {
    return <LoaderSkeleton />
  }

  return (
    <div
      style={{ width, height }}
      className={styles.slider}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
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
        <SlidesList />
        <Dots />
      </SliderContext.Provider>
    </div>
  )
}

export default Slider