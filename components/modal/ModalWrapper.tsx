'use client'

import { X } from 'lucide-react'
import {
  JSX,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
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
  fullScreen?: boolean
}

let openModalsCount = 0
let previousBodyOverflow = ''
const modalStack: string[] = []

export function ModalWrapper({
  id,
  title,
  children,
  className = '',
  keyId,
  onClose,
  fullScreen = false,
}: ModalWrapperProps) {
  const { isOpen, closeModal } = useModal(id, keyId)
  const [isMounted, setIsMounted] = useState(false)
  const modalId = useId()
  const titleId = useId()
  const modalContentRef = useRef<HTMLDivElement>(null)
  const previousFocusedElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => setIsMounted(true))

    return () => cancelAnimationFrame(animationFrame)
  }, [])

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
    if (!isOpen) return

    previousFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    modalStack.push(modalId)

    if (openModalsCount === 0) {
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    openModalsCount += 1

    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalStack.at(-1) !== modalId) return

      if (e.key === 'Escape') {
        handleClose()
        return
      }

      if (e.key !== 'Tab') return

      const focusableElements =
        modalContentRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )

      if (!focusableElements?.length) {
        e.preventDefault()
        modalContentRef.current?.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const animationFrame = requestAnimationFrame(() =>
      modalContentRef.current?.focus()
    )

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      cancelAnimationFrame(animationFrame)

      const modalStackIndex = modalStack.lastIndexOf(modalId)
      if (modalStackIndex !== -1) {
        modalStack.splice(modalStackIndex, 1)
      }
      openModalsCount -= 1

      if (openModalsCount === 0) {
        document.body.style.overflow = previousBodyOverflow
      }

      previousFocusedElementRef.current?.focus()
    }
  }, [isOpen, handleClose, modalId])

  if (!isOpen || !isMounted) return null

  return createPortal(
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div
        ref={modalContentRef}
        className={`${styles.modalContent} ${fullScreen ? styles.fullScreen : ''} ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : 'Модальное окно'}
        tabIndex={-1}
      >
        <div className={styles.modalHeader}>
          {title && (
            <div id={titleId} className={styles.modalTitle}>
              {title}
            </div>
          )}
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
    </div>,
    document.body
  )
}
