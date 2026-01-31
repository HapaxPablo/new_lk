'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { IImage } from '@/types/nomenclature'

interface PhotosTabContentProps {
  exterior: IImage[]
  interior: IImage[]
}

const Slider = dynamic(() => import('@/components/slider/Slider'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '200px',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ color: '#9ca3af' }}>Загрузка галереи...</span>
    </div>
  ),
})

export const PhotosTabContent = ({
  exterior,
  interior,
}: PhotosTabContentProps) => {
  const allImages = [...(exterior || []), ...(interior || [])]
  const exteriorCount = exterior?.length || 0
  const interiorCount = interior?.length || 0

  if (allImages.length === 0) {
    return <p>Фотографии отсутствуют</p>
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <p>📷 Всего фото: {allImages.length}</p>
        <p>Внешних: {exteriorCount}</p>
        <p>Внутренних: {interiorCount}</p>
      </div>

      {allImages.length > 0 && (
        <div
          style={{
            width: '100%',
            height: '300px',
            borderRadius: '0.5rem',
            overflow: 'hidden',
          }}
        >
          <Slider images={allImages} autoPlay={false} autoPlayTime={5000} />
        </div>
      )}
    </div>
  )
}
