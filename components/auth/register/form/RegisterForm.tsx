'use client'

import { useNotification } from '@/hooks/useNotification'
import { useState } from 'react'
import ConfirmRegistratrionForm from '../confirmRegistratrionForm/ConfirmRegistratrionForm'
import styles from './RegisterForm.module.scss'
import RegisterFormFields from './RegisterFormFields'

export function RegisterFormDesktop() {
  const [canConfirm, setCanConfritm] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const { showNotification } = useNotification()

  return (
    <div className={styles.container}>
      {!canConfirm ? (
        <RegisterFormFields
          setEmail={setEmail}
          setCanConfirm={setCanConfritm}
          showNotification={showNotification}
        />
      ) : (
        <ConfirmRegistratrionForm email={email} />
      )}
      <div className={styles.imgWrapper}>
        <div className={styles.img} />
      </div>
    </div>
  )
}
