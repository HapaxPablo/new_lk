'use client'

import { X } from 'lucide-react'
import { JSX, ReactNode, useCallback, useEffect } from 'react'
import styles from './ModalWrapper.module.scss'
import { useModal } from '@/providers/modal/ModalProvider'

import type { ModalType } from '@/providers/modal/ModalProvider'

interface ModalWrapperProps {
  id: ModalType
  keyId?: string // уникальный ключ для карточки
  title?: JSX.Element | string
  children: ReactNode
  className?: string
  onClose?: () => void
}

export function ModalWrapper({
  id,
  title,
  children,
  className = '',
  keyId,
  onClose,
}: ModalWrapperProps) {
  const { isOpen, closeModal } = useModal(id, keyId)

  const handleClose = useCallback(() => {
    closeModal()
    onClose?.()
  }, [closeModal, onClose])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleClose])

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div
        className={`${styles.modalContent} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          {title && <div className={styles.modalTitle}>{title}</div>}
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label={`Закрыть ${title || 'модальное окно'}`}
          >
            <X size={24} />
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  )
}
