'use client'

import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { useTooltip } from '@/providers/tooltip/TooltipProvider'
import styles from './TooltipModal.module.scss'
import Image from 'next/image'
interface TooltipModalProps {
  /** Функция для рендеринга данных в зависимости от типа */
  renderContent?: (data: any) => React.ReactNode
}

/**
 * Модальное окно для отображения подсказок.
 * Автоматически подписывается на контекст TooltipProvider.
 */
export function TooltipModal({ renderContent }: TooltipModalProps) {
  const { isTooltipOpen, tooltipData, closeTooltip } = useTooltip()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  // Сброс состояния при закрытии
  useEffect(() => {
    if (!isTooltipOpen) {
      setData(null)
      setError(null)
      setLoading(false)
    }
  }, [isTooltipOpen])

  // Загрузка данных при открытии
  useEffect(() => {
    if (isTooltipOpen && tooltipData?.endpoint) {
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTooltipOpen, tooltipData?.endpoint])

  const loadData = async () => {
    if (!tooltipData?.endpoint) return

    setLoading(true)
    setError(null)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
      const url = `${baseUrl}${tooltipData.endpoint}`

      const response = await fetch(url, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Произошла ошибка при загрузке данных'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeTooltip()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTooltip()
    }

    if (isTooltipOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isTooltipOpen, closeTooltip])

  if (!isTooltipOpen || !tooltipData) return null

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{tooltipData.title}</h2>
          <button
            onClick={() => closeTooltip()}
            className={styles.closeButton}
            aria-label="Закрыть"
          >
            <X size={24} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {loading && (
            <div className={styles.loading}>
              <Loader2 size={32} className={styles.spinner} />
              <span>Загрузка данных...</span>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>Ошибка: {error}</p>
            </div>
          )}

          {!loading && !error && data && (
            <div className={styles.content}>
              {renderContent ? (
                renderContent(data)
              ) : (
                <DefaultContent data={data} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Компонент для отображения данных по умолчанию
 */
function DefaultContent({ data }: { data: any }) {
    console.log(data);
    
  // Попробуем отобразить типичные поля
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
                  <Image
                src={value}
                alt={`Изображение ${field.label || 'места'}`}
                fill
                className={styles.image}
                sizes="80px"
              />
          
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
