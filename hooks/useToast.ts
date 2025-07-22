'use client'

import type { ToastOptions } from 'react-toastify'
import { toast } from 'react-toastify'

export type TToastType = 'success' | 'error' | 'info' | 'warning'

export const useToast = () => {
  const showToast = (
    text: string,
    type: TToastType = 'success',
    options?: ToastOptions
  ) => {
    toast[type](text, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...options,
    })
  }
  return { showToast }
}
