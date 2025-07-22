'use client'

import '@/styles/global.css'
import { ReactNode } from 'react'
import { Theme, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export interface ToastProviderProps {
  children: ReactNode
  theme?: Theme
}

export const ToastProvider = ({
  children,
  theme = 'colored',
}: ToastProviderProps) => {
  return (
    <>
      {children}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </>
  )
}
