'use client'
import React from 'react'

import styles from '../Slider.module.scss'
import Image from 'next/image'

export default function SlideImage({
  src,
  alt,
}: {
  src: string | null
  alt: string
}) {
  if (!src || src.trim() === '') {
    return null
  }
  console.log(src);
  
  return (
    <div className={styles.slider__list__slide__image}>
      <Image
        src={src}
        alt={alt}
        fill
        // sizes="(max-width: 800px) 100vw, 800px"
        // loading="lazy"
        // style={{ objectFit: 'contain', objectPosition: 'center' }}
        priority
      />
    </div>
  )
}
