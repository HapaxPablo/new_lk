'use client'

import { RefObject, useEffect, useId, useRef } from 'react'

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

let lockedDialogs = 0
let bodyOverflow = ''
const dialogStack: string[] = []

function lockBodyScroll() {
  if (lockedDialogs === 0) {
    bodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }

  lockedDialogs += 1
}

function unlockBodyScroll() {
  lockedDialogs = Math.max(0, lockedDialogs - 1)

  if (lockedDialogs === 0) {
    document.body.style.overflow = bodyOverflow
  }
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
    .filter((element) => !element.hasAttribute('disabled'))
    .filter((element) => element.getClientRects().length > 0)
}

interface UseDialogAccessibilityOptions {
  isOpen: boolean
  dialogRef: RefObject<HTMLElement | null>
  onClose: () => void
  initialFocusRef?: RefObject<HTMLElement | null>
}

export function useDialogAccessibility({
  isOpen,
  dialogRef,
  onClose,
  initialFocusRef,
}: UseDialogAccessibilityOptions) {
  const dialogId = useId()
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    const previouslyFocusedElement = document.activeElement as HTMLElement | null
    dialogStack.push(dialogId)
    lockBodyScroll()

    const focusInitialElement = () => {
      if (dialogStack.at(-1) !== dialogId) return

      const dialog = dialogRef.current
      if (!dialog) return

      const initialFocus = initialFocusRef?.current
      const focusTarget = initialFocus ?? getFocusableElements(dialog)[0] ?? dialog
      focusTarget.focus()
    }

    const animationFrame = requestAnimationFrame(focusInitialElement)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (dialogStack.at(-1) !== dialogId) return

      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab') return

      const dialog = dialogRef.current
      if (!dialog) return

      const focusableElements = getFocusableElements(dialog)
      if (focusableElements.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (
        event.shiftKey &&
        (activeElement === firstElement || !dialog.contains(activeElement))
      ) {
        event.preventDefault()
        lastElement.focus()
      } else if (
        !event.shiftKey &&
        (activeElement === lastElement || !dialog.contains(activeElement))
      ) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(animationFrame)
      document.removeEventListener('keydown', handleKeyDown)

      const wasTopDialog = dialogStack.at(-1) === dialogId
      const dialogIndex = dialogStack.lastIndexOf(dialogId)
      if (dialogIndex !== -1) dialogStack.splice(dialogIndex, 1)
      unlockBodyScroll()

      if (wasTopDialog && previouslyFocusedElement?.isConnected) {
        previouslyFocusedElement.focus()
      }
    }
  }, [dialogId, dialogRef, initialFocusRef, isOpen])
}
