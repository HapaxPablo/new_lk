'use client'

import { createContext } from 'react'
import { IImage } from '@/types/nomenclature'

export interface ISliderContext {
  goToSlide: (number: number) => void
  changeSlide: (direction?: number) => void
  slidesCount: number
  slideNumber: number
  images: IImage[]
  isFirstSlide: boolean
  isLastSlide: boolean
}

export const SliderContext = createContext<ISliderContext>({} as ISliderContext)