'use client'
import React, { useContext } from 'react'
import { SliderContext } from '../../SliderContext'
import styles from '../../Slider.module.scss'

export default function Dots() {
  const { goToSlide, slidesCount, slideNumber } = useContext(SliderContext)

  if (slidesCount <= 1) return null

  return (
    <div className={styles.slider__dots}>
      {Array.from({ length: slidesCount }).map((_, index) => (
        <button
          key={index}
          className={`${styles.slider__dots__dot} ${
            slideNumber === index ? styles.slider__dots__dot__selected : ''
          }`}
          onClick={() => goToSlide(index)}
          aria-label={`Перейти к слайду ${index + 1}`}
        />
      ))}
    </div>
  )
}
