'use client'

import React, { useCallback, useId, useRef, useState } from 'react'
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
  const tabRefs = useRef(new Map<string, HTMLButtonElement>())
  const instanceId = useId().replace(/:/g, '')
  const selectedTab = visibleItems.some(item => item.id === activeTab)
    ? activeTab
    : visibleItems[0]?.id

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = visibleItems.findIndex(item => item.id === selectedTab)
    if (currentIndex < 0) return

    let nextIndex = currentIndex
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % visibleItems.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = visibleItems.length - 1
    } else {
      return
    }

    event.preventDefault()
    const nextTab = visibleItems[nextIndex]
    handleTabClick(nextTab.id)
    tabRefs.current.get(nextTab.id)?.focus()
  }

  return (
    <div className={styles.tabsWrapper}>
      <div
        className={styles.tabsList}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        aria-label="Вкладки с информацией"
      >
        {visibleItems.map((tab) => (
          <React.Fragment key={tab.id}>
            <TabButton
              ref={element => {
                if (element) tabRefs.current.set(tab.id, element)
                else tabRefs.current.delete(tab.id)
              }}
              id={`${instanceId}-${tab.id}`}
              label={tab.label}
              icon={tab.icon}
              count={tab.count}
              isActive={selectedTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
              aria-controls={`panel-${instanceId}-${tab.id}`}
            />
          </React.Fragment>
        ))}
      </div>

      {visibleItems.map((tab) => (
        <React.Fragment key={tab.id}>
          <TabPanel
            id={`panel-${instanceId}-${tab.id}`}
            label={tab.label}
            isActive={selectedTab === tab.id}
            aria-labelledby={`tab-${instanceId}-${tab.id}`}
          >
            {tab.content}
          </TabPanel>
        </React.Fragment>
      ))}
    </div>
  )
}
