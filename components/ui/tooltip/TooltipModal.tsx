'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useTooltip } from '@/providers/tooltip/TooltipProvider'
import { useDialogAccessibility } from '@/components/modal/useDialogAccessibility'
import styles from './TooltipModal.module.scss'

interface TooltipModalProps {
  renderContent?: (data: any) => React.ReactNode
}

export function TooltipModal({ renderContent }: TooltipModalProps) {
  const { isTooltipOpen, tooltipData, closeTooltip } = useTooltip()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useDialogAccessibility({
    isOpen: isTooltipOpen,
    dialogRef,
    onClose: closeTooltip,
    initialFocusRef: closeButtonRef,
  })

  useEffect(() => {
    if (!isTooltipOpen) {
      setData(null)
      setError(null)
      setLoading(false)
    }
  }, [isTooltipOpen])

  useEffect(() => {
    const endpoint = tooltipData?.endpoint
    if (!isTooltipOpen || !endpoint) return

    const controller = new AbortController()

    async function loadData() {
      setLoading(true)
      setError(null)

      try {
        const proxyUrl = `/api/tooltip?endpoint=${encodeURIComponent(endpoint)}`
        const response = await fetch(proxyUrl, {
          credentials: 'include',
          signal: controller.signal,
        })

        if (response.status === 401) {
          setError('Сессия истекла. Пожалуйста, войдите снова.')
          return
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            errorData.error || `Ошибка ${response.status}: ${response.statusText}`
          )
        }

        const result = await response.json()
        if (!controller.signal.aborted) setData(result)
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Произошла ошибка при загрузке данных'
          )
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadData()
    return () => controller.abort()
  }, [isTooltipOpen, tooltipData?.endpoint])

  if (!isTooltipOpen || !tooltipData) return null

  return (
    <>
      <button
        type="button"
        className={styles.modalOverlay}
        onClick={closeTooltip}
        aria-label="Закрыть окно подсказки"
      />
      <div className={styles.modalPositioner}>
        <div
          ref={dialogRef}
          className={styles.modalContent}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
        >
          <div className={styles.modalHeader}>
            <h2 id={titleId} className={styles.modalTitle}>
              {tooltipData.title}
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeTooltip}
              className={styles.closeButton}
              aria-label="Закрыть окно подсказки"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.modalBody} aria-busy={loading}>
            {loading && (
              <div className={styles.loading}>
                <Loader2 size={32} className={styles.spinner} aria-hidden="true" />
                <span>Загрузка данных...</span>
              </div>
            )}

            {error && (
              <div className={styles.error} role="alert">
                <p>Ошибка: {error}</p>
              </div>
            )}

            {!loading && !error && data && (
              <div className={styles.content}>
                {renderContent ? renderContent(data) : <DefaultContent data={data} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function DefaultContent({ data }: { data: any }) {
  const fields = [
    { key: 'name', label: 'Название' },
    { key: 'description', label: 'Описание' },
    { key: 'logotype', label: 'Логотип', isImage: true },
    { key: 'code1c', label: 'Код 1С' },
    { key: 'created', label: 'Дата создания', isDate: true },
    { key: 'inn', label: 'ИНН' },
    { key: 'opf', label: 'ОПФ' },
    { key: 'address', label: 'Адрес' },
    { key: 'contact_persons', label: 'Контактные лица', isArray: true },
    { key: 'brands', label: 'Бренды', isArray: true },
  ]

  return (
    <div className={styles.defaultContent}>
      {fields.map((field) => {
        const value = data[field.key]
        if (value === undefined || value === null || value === '') return null

        let displayValue: React.ReactNode = value

        if (field.isImage && typeof value === 'string') {
          displayValue = (
            <div className="relative aspect-video">
              <Image
                src={value}
                alt={`Изображение ${field.label || 'места'}`}
                fill
                className={styles.image}
                sizes="80px"
                loading="lazy"
              />
            </div>
          )
        } else if (field.isDate && typeof value === 'string') {
          displayValue = new Date(value).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        } else if (field.isArray && Array.isArray(value)) {
          displayValue = value.length > 0 ? value.join(', ') : '-'
        }

        return (
          <div key={field.key} className={styles.field}>
            <span className={styles.fieldLabel}>{field.label}:</span>
            <span className={styles.fieldValue}>{displayValue}</span>
          </div>
        )
      })}

      {Object.keys(data).length === 0 && (
        <p className={styles.noData}>Нет данных для отображения</p>
      )}
    </div>
  )
}
