'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button/Button'
import { ModalWrapper } from '@/components/modal/ModalWrapper'
import { useModal } from '@/providers/modal/ModalProvider'
import { useToast } from '@/hooks/useToast'
import { ClientsMultiSelect, IClientOption } from './ClientsMultiSelect'
import {
  AdBroadcastSettings,
  REQUIRES_END_TIME,
  REQUIRES_START_TIME,
  REQUIRES_TIMEDELTA,
} from './AdBroadcastSettings'
import { fetchClientsPage, fetchPlaylistsPage, formatDateForApi } from '../api'
import { PlaylistSelect } from './PlaylistSelect'
import { OrderNameFields } from './OrderNameFields'
import { BroadcastIntervalFields } from './BroadcastIntervalFields'

const FORM_DEFAULT = {
  playlist: '',
  name: '',
  description: '',
  broadcastType: '0',
  lower: '',
  upper: '',
  timesInHour: '1',
  timedelta: '00:00:00',
  startTime: '',
  endTime: '',
  weight: '50',
}

export function ModalAddAdOrder() {
  const adOrderModal = useModal('ad_order')
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

  const parameters = useMemo(() => {
    const params: Record<string, number | string> = {
      times_in_hour: Number(form.timesInHour),
      weight: Number(form.weight),
    }
    if (REQUIRES_TIMEDELTA.includes(form.broadcastType))
      params.timedelta = form.timedelta
    if (REQUIRES_START_TIME.includes(form.broadcastType))
      params.start_time = form.startTime
    if (REQUIRES_END_TIME.includes(form.broadcastType))
      params.end_time = form.endTime
    return params
  }, [form])

  const validate = (): string | null => {
    if (!form.playlist) return 'Выберите плейлист'
    if (selectedClients.length === 0) return 'Укажите хотя бы одного клиента'
    if (!form.name.trim()) return 'Укажите название заказа'
    if (!form.lower || !form.upper) return 'Укажите интервал вещания'
    if (REQUIRES_TIMEDELTA.includes(form.broadcastType) && !form.timedelta)
      return 'Укажите смещение по времени'
    if (REQUIRES_START_TIME.includes(form.broadcastType) && !form.startTime)
      return 'Укажите время начала'
    if (REQUIRES_END_TIME.includes(form.broadcastType) && !form.endTime)
      return 'Укажите время окончания'
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
      const response = await fetch('/api/adorders/', {
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
          broadcast_type: Number(form.broadcastType),
          parameters,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        showToast(result.error || 'Ошибка при создании AD заказа', 'error')
        return
      }

      showToast('AD заказ успешно создан', 'success')
      resetForm()
      adOrderModal.closeModal()
    } catch (error) {
      console.error('AD order create error:', error)
      showToast('Ошибка при создании AD заказа', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button onClick={adOrderModal.openModal}>Создать рекламный заказ</Button>
      <ModalWrapper id="ad_order" title="Создать рекламный заказ">
        <div className="grid gap-4">
          <PlaylistSelect
            value={form.playlist}
            onChange={(id) => updateField('playlist', id)}
            fetchPage={fetchPlaylistsPage}
            isOpen={adOrderModal.isOpen}
            onError={(msg) => showToast(msg, 'error')}
          />

          <ClientsMultiSelect
            selected={selectedClients}
            onToggle={toggleClient}
            fetchPage={fetchClientsPage}
            isOpen={adOrderModal.isOpen}
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

          <AdBroadcastSettings
            broadcastType={form.broadcastType}
            onBroadcastTypeChange={(v) => updateField('broadcastType', v)}
            weight={form.weight}
            onWeightChange={(v) => updateField('weight', v)}
            timesInHour={form.timesInHour}
            onTimesInHourChange={(v) => updateField('timesInHour', v)}
            timedelta={form.timedelta}
            onTimedeltaChange={(v) => updateField('timedelta', v)}
            startTime={form.startTime}
            onStartTimeChange={(v) => updateField('startTime', v)}
            endTime={form.endTime}
            onEndTimeChange={(v) => updateField('endTime', v)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="default" onClick={adOrderModal.closeModal}>
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
