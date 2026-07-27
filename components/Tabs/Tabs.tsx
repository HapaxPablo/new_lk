'use client'

import React, { useState, useCallback } from 'react'
import styles from './Tabs.module.scss'
import { TabButton } from './TabButton'
import { TabPanel } from './TabPanel'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  count?: number
  content: React.ReactNode
  visual?: boolean
}

interface TabsProps {
  items: TabItem[]
  defaultTab?: string
  onTabChange?: (tabId: string) => void
}

export const Tabs = ({ items, defaultTab, onTabChange }: TabsProps) => {
  const visibleItems = items.filter(item => item.visual !== false)

  const [activeTab, setActiveTab] = useState(defaultTab || visibleItems[0]?.id)

  const handleTabClick = useCallback(
    (tabId: string) => {
      setActiveTab(tabId)
      onTabChange?.(tabId)
    },
    [onTabChange]
  )

  if (!visibleItems || visibleItems.length === 0) {
    return null
  }

  return (
    <div className={styles.tabsWrapper}>
      <div
        className={styles.tabsList}
        role="tablist"
        aria-label="Вкладки с информацией"
      >
        {visibleItems.map((tab) => (
          <React.Fragment key={tab.id}>
            <TabButton
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              count={tab.count}
              isActive={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
              aria-controls={`panel-${tab.id}`}
            />
          </React.Fragment>
        ))}
      </div>

      {visibleItems.map((tab) => (
        <React.Fragment key={tab.id}>
          <TabPanel
            id={`panel-${tab.id}`}
            label={tab.label}
            isActive={activeTab === tab.id}
            aria-labelledby={`tab-${tab.id}`}
          >
            {tab.content}
          </TabPanel>
        </React.Fragment>
      ))}
    </div>
  )
}