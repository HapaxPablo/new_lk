export type TStatusType = 0 | 1 | 2 | 3 | null

export interface IStatusConfig {
  label: string
  color: string
  bgColor: string
  icon?: string
  description?: string
}

export const STATUS_MAP: Record<NonNullable<TStatusType>, IStatusConfig> = {
  0: {
    label: 'Онлайн',
    color: 'text-green-800',
    bgColor: 'bg-green-100 hover:bg-green-200',
    icon: '🟢',
    description: 'Устройство активно и работает нормально',
  },
  1: {
    label: 'Оффлайн 5 минут',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-100 hover:bg-yellow-200',
    icon: '🟡',
    description: 'Устройство не отвечает менее 5 минут',
  },
  2: {
    label: 'Недоступна более часа',
    color: 'text-red-800',
    bgColor: 'bg-red-100 hover:bg-red-200',
    icon: '🔴',
    description: 'Устройство недоступно более часа',
  },
  3: {
    label: 'Все',
    color: 'text-blue-800',
    bgColor: 'bg-blue-100 hover:bg-blue-200',
    icon: '🔵',
    description: 'Все устройства',
  },
}

// Конфиг для null статуса
export const NULL_STATUS_CONFIG: IStatusConfig = {
  label: 'Неизвестен',
  color: 'text-gray-700',
  icon: '⚪️',
  bgColor: 'bg-gray-100',
  description: 'Статус устройства не определен',
}

// Хелпер для получения конфига статуса
export function getStatusConfig(status: TStatusType): IStatusConfig {
  if (status === null || status === undefined) {
    return NULL_STATUS_CONFIG
  }
  return STATUS_MAP[status] || NULL_STATUS_CONFIG
}
