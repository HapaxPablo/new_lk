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
}

interface TabsProps {
  items: TabItem[]
  defaultTab?: string
  onTabChange?: (tabId: string) => void
}

export const Tabs = ({ items, defaultTab, onTabChange }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id)

  const handleTabClick = useCallback(
    (tabId: string) => {
      setActiveTab(tabId)
      onTabChange?.(tabId)
    },
    [onTabChange]
  )

  if (!items || items.length === 0) {
    return (
      <div className={styles.tabsWrapper}>
        <p className={styles.emptyState}>Нет доступных вкладок</p>
      </div>
    )
  }

  return (
    <div className={styles.tabsWrapper}>
      <div
        className={styles.tabsList}
        role="tablist"
        aria-label="Вкладки с информацией"
      >
        {items.map((tab) => (
          <TabButton
            key={tab.id}
            id={tab.id}
            label={tab.label}
            icon={tab.icon}
            count={tab.count}
            isActive={activeTab === tab.id}
            onClick={() => handleTabClick(tab.id)}
            aria-controls={`panel-${tab.id}`}
          />
        ))}
      </div>

      {items.map((tab) => (
        <TabPanel
          key={tab.id}
          id={`panel-${tab.id}`}
          label={tab.label}
          isActive={activeTab === tab.id}
          aria-labelledby={`tab-${tab.id}`}
        >
          {tab.content}
        </TabPanel>
      ))}
    </div>
  )
}
