import React from 'react'
import styles from './FieldLabel.module.scss'

interface FieldLabelProps {
  text: string
  className?: string
  ariaLabel?: string
}

export const FieldLabel: React.FC<FieldLabelProps> = ({
  text,
  className = '',
  ariaLabel,
}) => {
  const props: any = { className, 'aria-label': ariaLabel }
  return (
    <label {...props} className={`${styles.label} ${className}`} aria-label={ariaLabel}>
      
      {text}
    </label>
  )
}
