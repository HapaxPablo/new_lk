'use client'
import React from 'react'
import styles from './Loader.module.scss'

type LoaderSize = 'small' | 'medium' | 'large'
type LoaderVariant = 'primary' | 'success' | 'warning' | 'error'

interface LoaderProps {
  size?: LoaderSize
  variant?: LoaderVariant
  className?: string
  style?: React.CSSProperties
}

const SIZE_CLASSES: Record<LoaderSize, string> = {
  small: styles.loaderSmall,
  medium: styles.loaderMedium,
  large: styles.loaderLarge,
}

const VARIANT_CLASSES: Record<LoaderVariant, string> = {
  primary: styles.loaderPrimary,
  success: styles.loaderSuccess,
  warning: styles.loaderWarning,
  error: styles.loaderError,
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  variant = 'primary',
  className = '',
  style,
}) => {
  const sizeClass = SIZE_CLASSES[size]
  const variantClass = VARIANT_CLASSES[variant]

  return (
    <div
      className={`${styles.loader} ${sizeClass} ${variantClass} ${className}`}
      style={style}
      aria-label="Loading"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
