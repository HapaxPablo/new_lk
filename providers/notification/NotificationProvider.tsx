'use client'

import '@/styles/global.css'
import { ReactNode } from 'react'
import { Theme, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export interface NotificationProviderProps {
  children: ReactNode
  theme?: Theme
}

export const NotificationProvider = ({
  children,
  theme = 'colored',
}: NotificationProviderProps) => {
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
