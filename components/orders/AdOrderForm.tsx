'use client'

import { useMemo, useState } from 'react'
import {
  ClientsMultiSelect,
  IClientOption,
} from '@/components/orders/supporting-components/ClientsMultiSelect'
import { PlaylistSelect } from '@/components/orders/supporting-components/PlaylistSelect'
import { OrderNameFields } from '@/components/orders/supporting-components/OrderNameFields'
import { BroadcastIntervalFields } from '@/components/orders/supporting-components/BroadcastIntervalFields'
import {
  AdBroadcastSettings,
  REQUIRES_END_TIME,
  REQUIRES_START_TIME,
  REQUIRES_TIMEDELTA,
} from '@/components/orders/supporting-components/AdBroadcastSettings'
import {
  fetchClientsPage,
  fetchPlaylistsPage,
  formatDateForApi,
} from '@/app/(main)/orders/api'
import { OrderFormShell } from './OrderFormShell'
import { FormRow } from './FormRow'
import { useCreateOrderSubmit } from '@/hooks/useCreateOrderSubmit'

const AD_FORM_DEFAULT = {
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
  weight: '70',
}

export function AdOrderForm() {
  const [form, setForm] = useState(AD_FORM_DEFAULT)
  const [selectedClients, setSelectedClients] = useState<IClientOption[]>([])
  const { submit, isSubmitting, router, showToast } = useCreateOrderSubmit({
    successMessage: 'AD заказ успешно создан',
    errorMessage: 'Ошибка при создании AD заказа',
  })

  const updateField = <K extends keyof typeof AD_FORM_DEFAULT>(
    key: K,
    value: string
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const toggleClient = (item: IClientOption) =>
    setSelectedClients((prev) =>
      prev.some((c) => c.id === item.id)
        ? prev.filter((c) => c.id !== item.id)
        : [...prev, item]
    )

  const parameters = useMemo(() => {
    const paramsObj: Record<string, number | string> = {
      times_in_hour: Number(form.timesInHour),
      weight: Number(form.weight),
    }
    if (REQUIRES_TIMEDELTA.includes(form.broadcastType))
      paramsObj.timedelta = form.timedelta
    if (REQUIRES_START_TIME.includes(form.broadcastType))
      paramsObj.start_time = form.startTime
    if (REQUIRES_END_TIME.includes(form.broadcastType))
      paramsObj.end_time = form.endTime
    return paramsObj
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

    await submit(() =>
      fetch('/api/adorders/', {
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
    )
  }

  return (
    <OrderFormShell
      title="Создать рекламный заказ"
      description="Выберите плейлист, аудиторию, интервал вещания и настройте расписание показа рекламного ролика."
      isSubmitting={isSubmitting}
      onCancel={() => router.push('/orders')}
      onSubmit={handleSubmit}
    >
      <FormRow>
        <PlaylistSelect
          value={form.playlist}
          onChange={(id) => updateField('playlist', id)}
          fetchPage={fetchPlaylistsPage}
          isOpen
          onError={(msg) => showToast(msg, 'error')}
        />

        <ClientsMultiSelect
          selected={selectedClients}
          onToggle={toggleClient}
          fetchPage={fetchClientsPage}
          isOpen
          onError={(msg) => showToast(msg, 'error')}
        />
      </FormRow>

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
    </OrderFormShell>
  )
}
