'use client'

import { createContext, useContext, useState, useCallback } from 'react'

export type ModalType =
  | 'search'
  | 'notifications'
  | 'responsible_details'
  | 'location_permission'
  | 'city_confirmation'
  | 'feedback'

type ModalContextType = {
  openModal: (id: ModalType, key?: string) => void
  closeModal: (id: ModalType, key?: string) => void
  isOpen: (id: ModalType, key?: string) => boolean
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<Record<string, boolean>>({})

  const getKey = (id: ModalType, key?: string) => `${id}${key ? '_' + key : ''}`

  const openModal = useCallback((id: ModalType, key?: string) => {
    setModals((prev) => ({ ...prev, [getKey(id, key)]: true }))
  }, [])

  const closeModal = useCallback((id: ModalType, key?: string) => {
    setModals((prev) => ({ ...prev, [getKey(id, key)]: false }))
  }, [])

  const isOpen = useCallback(
    (id: ModalType, key?: string) => !!modals[getKey(id, key)],
    [modals]
  )

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal(id: ModalType, key?: string) {
  const context = useContext(ModalContext)
  if (!context) throw new Error('useModal must be used within a ModalProvider')

  return {
    isOpen: context.isOpen(id, key),
    openModal: () => context.openModal(id, key),
    closeModal: () => context.closeModal(id, key),
  }
}
