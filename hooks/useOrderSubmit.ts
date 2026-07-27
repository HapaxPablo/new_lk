import { RefObject, useRef, useState } from 'react'
import { useNomenclatureStore } from '@/store/useNomenclatureStore'
import { formatDateForApi } from './useDateRange'

export interface FormState {
  duration: string
  all_days: boolean
  days_of_week: string[]
}

export interface FormErrors {
  days_of_week?: string
  nomenclature_ids?: string
  submit?: string
}

const FORM_DEFAULT: FormState = {
  duration: '30',
  all_days: true,
  days_of_week: [],
}

export function useOrderSubmit(
  parsedStartRef: RefObject<Date>,
  parsedEndRef: RefObject<Date>,
  onSuccess: () => void,
  onAuthRequired: () => void
) {
  const { ids, setInitial } = useNomenclatureStore()
  const lastPayloadRef = useRef<object | null>(null)

  const [form, setForm] = useState<FormState>(FORM_DEFAULT)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!form.all_days && form.days_of_week.length === 0)
      e.days_of_week = 'Выберите хотя бы один день недели'
    if (ids.length === 0)
      e.nomenclature_ids = 'Выберите хотя бы одно место размещения'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const sendRequest = async (payload: object) => {
    lastPayloadRef.current = payload
    setSubmitting(true)
    setErrors({})
    setSuccess(false)
    try {
      const res = await fetch('/api/order/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: Number(form.duration),
          start_date: parsedStartRef.current
            ? formatDateForApi(parsedStartRef.current)
            : null,
          end_date: parsedEndRef.current
            ? formatDateForApi(parsedEndRef.current)
            : null,
          all_days: form.all_days,
          days_of_week: form.all_days ? [] : form.days_of_week,
          nomenclature_ids: ids,
        }),
      })
      if (!res.ok) {
        if (res.status === 401) {
          onAuthRequired()
          return
        }
        const data = await res.json()
        setErrors({
          submit:
            data?.days_of_week?.[0] ??
            data?.nomenclature_ids?.[0] ??
            data?.detail ??
            'Ошибка при создании заказа',
        })
        return
      }
      setSuccess(true)
      setForm(FORM_DEFAULT)
      setInitial([], [])
      onSuccess()
    } catch {
      setErrors({ submit: 'Нет соединения с сервером' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    if (!validate()) return
    await sendRequest({
      duration: Number(form.duration),
      start_date: parsedStartRef.current?.toISOString(),
      end_date: parsedEndRef.current?.toISOString(),
      all_days: form.all_days,
      days_of_week: form.all_days ? [] : form.days_of_week,
      nomenclature_ids: ids,
    })
  }

  const retrySubmit = async () => {
    if (!lastPayloadRef.current) return
    await sendRequest(lastPayloadRef.current)
  }

  return {
    form,
    setForm,
    submitting,
    success,
    errors,
    handleSubmit,
    retrySubmit,
  }
}
