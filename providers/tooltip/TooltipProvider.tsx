'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'

export interface TooltipData {
  id: string
  endpoint: string
  title: string
}

type ModalContextType = {
  openTooltip: (data: TooltipData) => void
  closeTooltip: () => void
  isTooltipOpen: boolean
  tooltipData: TooltipData | null
}

const TooltipContext = createContext<ModalContextType | undefined>(undefined)

export function TooltipProvider({ children }: { children: ReactNode }) {
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null)

  const openTooltip = useCallback((data: TooltipData) => {
    setTooltipData(data)
  }, [])

  const closeTooltip = useCallback(() => {
    setTooltipData(null)
  }, [])

  const isTooltipOpen = tooltipData !== null

  return (
    <TooltipContext.Provider
      value={{ openTooltip, closeTooltip, isTooltipOpen, tooltipData }}
    >
      {children}
    </TooltipContext.Provider>
  )
}

export function useTooltip() {
  const context = useContext(TooltipContext)
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider')
  }
  return context
}
