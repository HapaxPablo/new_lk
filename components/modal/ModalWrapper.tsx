'use client'

import { X } from 'lucide-react'
import { JSX, ReactNode, useCallback, useId, useRef } from 'react'
import styles from './ModalWrapper.module.scss'
import { useModal } from '@/providers/modal/ModalProvider'
import { useDialogAccessibility } from './useDialogAccessibility'

import type { ModalType } from '@/providers/modal/ModalProvider'

interface ModalWrapperProps {
  id: ModalType
  keyId?: string
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
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  const handleClose = useCallback(() => {
    closeModal()
    onClose?.()
  }, [closeModal, onClose])

  useDialogAccessibility({
    isOpen,
    dialogRef,
    onClose: handleClose,
    initialFocusRef: closeButtonRef,
  })

  if (!isOpen) return null

  return (
    <>
      <button
        type="button"
        className={styles.modalOverlay}
        onClick={handleClose}
        aria-label="Закрыть модальное окно"
      />
      <div className={styles.modalPositioner}>
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : 'Модальное окно'}
          tabIndex={-1}
          className={`${styles.modalContent} ${className}`}
        >
          <div className={styles.modalHeader}>
            {title && (
              <h2 id={titleId} className={styles.modalTitle}>
                {title}
              </h2>
            )}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              className={styles.closeButton}
              aria-label={`Закрыть ${title || 'модальное окно'}`}
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>
          <div className={styles.modalBody}>{children}</div>
        </div>
      </div>
    </>
  )
}
