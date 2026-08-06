'use client'

import { Button, Menu } from '@mantine/core'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { TASK_TYPES, type TTaskType } from '@/types/orders'

interface OrderActionsProps {
  nomenclatureId: string
  orderId: string
  taskType: TTaskType
}

export function OrderActions({
  nomenclatureId,
  orderId,
  taskType,
}: OrderActionsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  const cancelOrder = async () => {
    const isConfirmed = window.confirm(
      'Отменить заказ? Это действие будет отправлено на выполнение.'
    )

    if (!isConfirmed) return

    setIsSubmitting(true)

    try {
      const response = await fetch(
        `/api/tasks/${encodeURIComponent(nomenclatureId)}/actions/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: taskType,
            parameters: { order_id: orderId },
          }),
        }
      )

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || 'Не удалось отменить заказ')
      }

      showToast('Действие отправлено на выполнение')
      router.refresh()
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Не удалось отменить заказ',
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Menu position="bottom-end" shadow="md" width={220}>
      <Menu.Target>
        <Button
          variant="light"
          rightSection={<ChevronDown size={16} />}
          loading={isSubmitting}
        >
          Действия
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{TASK_TYPES[taskType]}</Menu.Label>
        <Menu.Item color="red" onClick={cancelOrder} disabled={isSubmitting}>
          Отменить заказ
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
