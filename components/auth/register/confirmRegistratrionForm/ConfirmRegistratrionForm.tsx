'use client'

import { Button } from '@/components/ui/button/Button'
import { useNotification } from '@/hooks/useNotification'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import styles from './ConfirmRegistratrionForm.module.scss'

export default function ConfirmRegistratrionForm({ email }: { email: string }) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const { showNotification } = useNotification()
  const router = useRouter()

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return // только цифры или пусто

    const newInput = inputsRef.current[index]
    if (newInput) newInput.value = value

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (
      e.key === 'Backspace' &&
      !inputsRef.current[index]?.value &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleConfirm = async (verificationCode: string) => {
    try {
      const response = await fetch('/api/auth/registration/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }),
      })

      const result = await response.json()

      if (!response.ok || !result.result) {
        showNotification(`${result.message}`, 'error')
      } else {
        showNotification(`${result.message}`, 'success')
        router.push('/nomenclatures')
      }
    } catch (err) {
      console.error('Ошибка сети или сервера')
    }
  }

  const handleButtonClick = () => {
    const code = inputsRef.current.map((input) => input?.value || '').join('')
    handleConfirm(code)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Введите код подтверждения</h2>
      <div className={styles.codeInputs}>
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            inputMode="numeric"
            className={styles.input}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => {
              inputsRef.current[index] = el
            }}
          />
        ))}
      </div>
      <Button
        type="button"
        variant="primary"
        fullWidth
        onClick={handleButtonClick}
      >
        Подтвердить
      </Button>
    </div>
  )
}
