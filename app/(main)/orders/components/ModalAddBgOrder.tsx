'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button/Button'
import { ModalWrapper } from '@/components/modal/ModalWrapper'
import { useModal } from '@/providers/modal/ModalProvider'
import { useToast } from '@/hooks/useToast'
import { ClientsMultiSelect, IClientOption } from './ClientsMultiSelect'
import { fetchClientsPage, fetchPlaylistsPage, formatDateForApi } from '../api'
import { PlaylistSelect } from './PlaylistSelect'
import { OrderNameFields } from './OrderNameFields'
import { BroadcastIntervalFields } from './BroadcastIntervalFields'

const FORM_DEFAULT = {
  playlist: '',
  name: '',
  description: '',
  lower: '',
  upper: '',
}

export function ModalAddBgOrder() {
  const bgOrderModal = useModal('bg_order')
  const { showToast } = useToast()

  const [form, setForm] = useState(FORM_DEFAULT)
  const [selectedClients, setSelectedClients] = useState<IClientOption[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = <K extends keyof typeof FORM_DEFAULT>(
    key: K,
    value: string
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const toggleClient = (item: IClientOption) =>
    setSelectedClients((prev) =>
      prev.some((c) => c.id === item.id)
        ? prev.filter((c) => c.id !== item.id)
        : [...prev, item]
    )

  const resetForm = () => {
    setForm(FORM_DEFAULT)
    setSelectedClients([])
  }

  const validate = (): string | null => {
    if (!form.playlist) return 'Выберите плейлист'
    if (selectedClients.length === 0) return 'Укажите хотя бы одного клиента'
    if (!form.name.trim()) return 'Укажите название заказа'
    if (!form.lower || !form.upper) return 'Укажите интервал вещания'
    return null
  }

  const handleSubmit = async () => {
    const validationError = validate()
    if (validationError) {
      showToast(validationError, 'error')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/bgorders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playlist: form.playlist,
          clients: selectedClients.map((c) => c.id),
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          broadcast_interval: {
            lower: formatDateForApi(form.lower),
            upper: formatDateForApi(form.upper),
          },
          parameters: {},
          order_type: 0,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        showToast(
          result.error || 'Ошибка при создании заказа фоновой музыки',
          'error'
        )
        return
      }

      showToast('Заказ фоновой музыки успешно создан', 'success')
      resetForm()
      bgOrderModal.closeModal()
    } catch (error) {
      console.error('BG order create error:', error)
      showToast('Ошибка при создании заказа фоновой музыки', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button onClick={bgOrderModal.openModal}>
        Создать заказ фоновой музыки
      </Button>
      <ModalWrapper id="bg_order" title="Создать заказ фоновой музыки">
        <div className="grid gap-4">
          <PlaylistSelect
            value={form.playlist}
            onChange={(id) => updateField('playlist', id)}
            fetchPage={fetchPlaylistsPage}
            isOpen={bgOrderModal.isOpen}
            onError={(msg) => showToast(msg, 'error')}
          />

          <ClientsMultiSelect
            selected={selectedClients}
            onToggle={toggleClient}
            fetchPage={fetchClientsPage}
            isOpen={bgOrderModal.isOpen}
            onError={(msg) => showToast(msg, 'error')}
          />

          <OrderNameFields
            name={form.name}
            description={form.description}
            onNameChange={(v) => updateField('name', v)}
            onDescriptionChange={(v) => updateField('description', v)}
          />

          <BroadcastIntervalFields
            lower={form.lower}
            upper={form.upper}
            onLowerChange={(v) => updateField('lower', v)}
            onUpperChange={(v) => updateField('upper', v)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="default" onClick={bgOrderModal.closeModal}>
              Отменить
            </Button>
            <Button onClick={handleSubmit} isLoading={isSubmitting}>
              Создать заказ
            </Button>
          </div>
        </div>
      </ModalWrapper>
    </>
  )
}
