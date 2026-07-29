'use client'

import { useState } from 'react'
import {
  ClientsMultiSelect,
  IClientOption,
} from '@/app/(main)/orders/components/ClientsMultiSelect'
import { PlaylistSelect } from '@/app/(main)/orders/components/PlaylistSelect'
import { OrderNameFields } from '@/app/(main)/orders/components/OrderNameFields'
import { BroadcastIntervalFields } from '@/app/(main)/orders/components/BroadcastIntervalFields'
import {
  fetchClientsPage,
  fetchPlaylistsPage,
  formatDateForApi,
} from '@/app/(main)/orders/api'
import { ORDER_TYPE_LABELS } from '@/types/orders'
import { OrderFormShell } from './OrderFormShell'
import { FormRow } from './FormRow'
import { useCreateOrderSubmit } from '@/hooks/useCreateOrderSubmit'

const BG_FORM_DEFAULT = {
  playlist: '',
  name: '',
  description: '',
  lower: '',
  upper: '',
  orderType: '0',
}

export function BgOrderForm() {
  const [form, setForm] = useState(BG_FORM_DEFAULT)
  const [selectedClients, setSelectedClients] = useState<IClientOption[]>([])
  const { submit, isSubmitting, router, showToast } = useCreateOrderSubmit({
    successMessage: 'Заказ фоновой музыки успешно создан',
    errorMessage: 'Ошибка при создании заказа фоновой музыки',
  })

  const updateField = <K extends keyof typeof BG_FORM_DEFAULT>(
    key: K,
    value: string
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const toggleClient = (item: IClientOption) =>
    setSelectedClients((prev) =>
      prev.some((c) => c.id === item.id)
        ? prev.filter((c) => c.id !== item.id)
        : [...prev, item]
    )

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

    await submit(() =>
      fetch('/api/bgorders/', {
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
          order_type: Number(form.orderType),
        }),
      })
    )
  }

  return (
    <OrderFormShell
      title="Создать заказ фоновой музыки"
      description="Выберите плейлист, аудиторию и интервал вещания фоновой музыки."
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

      <FormRow>
        <BroadcastIntervalFields
          lower={form.lower}
          upper={form.upper}
          onLowerChange={(v) => updateField('lower', v)}
          onUpperChange={(v) => updateField('upper', v)}
        />

        <div className="grid gap-2">
          <label className="text-sm font-medium text-gray-700">
            Тип контента
          </label>
          <select
            value={form.orderType}
            onChange={(e) => updateField('orderType', e.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
          >
            {Object.entries(ORDER_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {value} — {label}
              </option>
            ))}
          </select>
        </div>
      </FormRow>
    </OrderFormShell>
  )
}
