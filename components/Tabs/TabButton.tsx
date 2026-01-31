'use client'

import React, { forwardRef } from 'react'
import styles from './Tabs.module.scss'

interface TabButtonProps {
  id: string
  label: string
  icon?: React.ReactNode
  count?: number
  isActive: boolean
  onClick: () => void
  'aria-controls': string
}

export const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(
  (
    {
      id,
      label,
      icon,
      count,
      isActive,
      onClick,
      'aria-controls': ariaControls,
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        id={`tab-${id}`}
        className={`${styles.tabButton} ${isActive ? styles.active : ''}`}
        onClick={onClick}
        aria-selected={isActive}
        aria-controls={ariaControls}
        role="tab"
        tabIndex={isActive ? 0 : -1}
      >
        {icon && (
          <span className={styles.iconWrapper} aria-hidden="true">
            {icon}
          </span>
        )}
        {label}
        {count !== undefined && count !== null && (
          <span className={styles.count}>({count})</span>
        )}
      </button>
    )
  }
)

TabButton.displayName = 'TabButton'
