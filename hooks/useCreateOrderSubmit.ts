'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'

interface UseCreateOrderSubmitOptions {
  successMessage: string
  errorMessage: string
}

export function useCreateOrderSubmit({
  successMessage,
  errorMessage,
}: UseCreateOrderSubmitOptions) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (request: () => Promise<Response>) => {
    setIsSubmitting(true)
    try {
      const response = await request()
      const result = await response.json().catch(() => null)

      if (!response.ok) {
        showToast(result?.error || errorMessage, 'error')
        return false
      }

      showToast(successMessage, 'success')
      router.push('/orders')
      return true
    } catch (error) {
      console.error(errorMessage, error)
      showToast(errorMessage, 'error')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submit, isSubmitting, router, showToast }
}
