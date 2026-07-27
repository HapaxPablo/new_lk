'use client'

import { useToast } from '@/hooks/useToast'
import { useState } from 'react'
import ConfirmRegistratrionForm from '../confirmRegistratrionForm/ConfirmRegistratrionForm'
import styles from './RegisterForm.module.scss'
import RegisterFormFields from './RegisterFormFields'

export function RegisterFormDesktop() {
  const [canConfirm, setCanConfritm] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const { showToast } = useToast()

  return (
    <div className={styles.container}>
      {!canConfirm ? (
        <RegisterFormFields
          setEmail={setEmail}
          setCanConfirm={setCanConfritm}
          showToast={showToast}
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
