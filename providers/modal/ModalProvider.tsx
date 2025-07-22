'use client'

import { createContext, useContext, useState, useCallback } from 'react'

type ModalType = 'search' | 'notifications'

type ModalContextType = {
  openModal: (type: ModalType) => void
  closeModal: (type: ModalType) => void
  isOpen: (type: ModalType) => boolean
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<Record<ModalType, boolean>>({
    search: false,
    notifications: false,
  })

  const openModal = useCallback((type: ModalType) => {
    setModals((prev) => ({ ...prev, [type]: true }))
  }, [])

  const closeModal = useCallback((type: ModalType) => {
    setModals((prev) => ({ ...prev, [type]: false }))
  }, [])

  const isOpen = useCallback((type: ModalType) => modals[type], [modals])

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal(type: ModalType) {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }

  return {
    isOpen: context.isOpen(type),
    openModal: () => context.openModal(type),
    closeModal: () => context.closeModal(type),
  }
}
