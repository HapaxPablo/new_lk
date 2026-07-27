'use client'

import React, { forwardRef } from 'react'
import styles from './Tabs.module.scss'

interface TabPanelProps {
  id: string
  label: string
  children: React.ReactNode
  isActive: boolean
  'aria-labelledby': string
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  (
    { id, label, children, isActive, 'aria-labelledby': ariaLabelledBy },
    ref
  ) => {

    const hasContent = children !== null && children !== undefined

    const renderContent = () => {
      if (!hasContent) {
        return (
          <p className={styles.emptyState}>
            Информация в разделе «{label}» отсутствует
          </p>
        )
      }
      return children
    }

    return (
      <div
        ref={ref}
        id={id}
        className={styles.tabContent}
        role="tabpanel"
        aria-labelledby={ariaLabelledBy}
        aria-hidden={!isActive}
        hidden={!isActive}
      >
        {renderContent()}
      </div>
    )
  }
)

TabPanel.displayName = 'TabPanel'
