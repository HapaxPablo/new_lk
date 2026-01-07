'use client'

import { createContext, useEffect, useState, use, useCallback } from 'react'
import styles from './Slider.module.scss'
import Arrows from './components/Controls/Arrows'
import SlidesList from './components/SlidesList'
import Dots from './components/Controls/Dots'
import LoaderSkeleton from '../ui/loader/LoaderSkeleton'

interface ISliderItem {
  id?: string
  src?: string | null
  alt?: string
}

interface ISliderProps {
  autoPlay: boolean
  autoPlayTime: number
  width?: string | number
  height?: string | number
  items?: ISliderItem[]
}

interface ISliderContext {
  goToSlide: (number: number) => void
  changeSlide: (direction?: number) => void
  slidesCount: number
  slideNumber: number
  items: any[]
}

export const SliderContext = createContext<ISliderContext>({} as ISliderContext)

// console.log(await getImages())

const Slider = function ({
  width,
  height,
  autoPlay,
  autoPlayTime,
  items: propItems,
}: ISliderProps) {
  const [items, setItems] = useState<ISliderItem[]>([])
  const [slide, setSlide] = useState(0)
  const [touchPosition, setTouchPosition] = useState<number | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (propItems) {
        setItems(propItems)
      } else {
        try {
          //   const images = await getImages()
          setItems([])
        } catch (error) {
          console.error('Failed to load images:', error)
        }
      }
    }
    loadData()
  }, [propItems])

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
    if (!autoPlay || items.length === 0) return

    const interval = setInterval(() => {
      changeSlide(1)
    }, autoPlayTime)

    return () => {
      clearInterval(interval)
    }
  }, [items.length, autoPlay, autoPlayTime, changeSlide])

  if (items.length === 0) {
    return (
      // <div style={{ width: width, height: height }}>
        <LoaderSkeleton />
      // {/* </div> */}
    )
  }

  return (
    <div
      // style={{ width, height }}
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
          items,
        }}
      >
        <Arrows />
        <SlidesList />
        <Dots />
      </SliderContext.Provider>
    </div>
  )
}

Slider.defaultProps = {
  autoPlay: false,
  autoPlayTime: 5000,
  width: '100%',
  height: '100%',
}

export default Slider
