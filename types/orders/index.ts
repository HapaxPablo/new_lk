export interface IOrderOwner {
  full_name: string
}

export interface IOrderPlaylist {
  id: string
  name: string
  files_count: number
}

export interface IOrderClient {
  id: string
  name: string
}

export interface IBroadcastInterval {
  lower: string
  upper: string
}

export const BROADCAST_TYPE_LABELS: Record<number, string> = {
  0: 'По режиму работы точки',
  1: 'От начала работы + смещение',
  2: 'От смещения до окончания работы',
  3: 'Конкретное время (start_time — end_time)',
  4: 'От начала работы до фиксированного времени',
  5: 'От фиксированного времени до окончания работы',
  6: 'По событию',
}

export const ORDER_TYPE_LABELS: Record<number, string> = {
  0: 'Фоновая музыка',
  1: 'Фоновые видео',
  2: 'Фоновые картинки',
  3: 'Бегущая строка',
}

export const ORDER_STATUS_LABELS: Record<number, string> = {
  0: 'Ожидает эфира',
  1: 'В эфире',
  2: 'Завершён',
  3: 'Отменён',
  4: 'Ошибка',
}

export const TASK_TYPES = {
  5: 'CANCEL_BGMUSIC',
  6: 'CANCEL_BGVIDEO',
  7: 'CANCEL_BGIMAGE',
  8: 'CANCEL_TICKER',
  9: 'CANCEL_AD',
} as const

export type TTaskType = keyof typeof TASK_TYPES

export interface IAdOrderParameters {
  times_in_hour?: number
  weight?: number
  timedelta?: [number, number, number] | string
  start_time?: string
  end_time?: string
}

export interface IAdOrderDetail {
  id: string
  name: string
  description?: string | null
  owner: IOrderOwner
  playlist: IOrderPlaylist
  slides: Record<string, string[]> | null
  broadcast_interval: IBroadcastInterval
  broadcast_type: number
  parameters: IAdOrderParameters
  status: number
  created: string
  client: IOrderClient
  is_permanent?: boolean
}

export interface IBgOrderDetail {
  id: string
  name: string
  description?: string | null
  owner: IOrderOwner
  order_type: number
  playlist: IOrderPlaylist
  broadcast_interval: IBroadcastInterval
  parameters: Record<string, any>
  status: number
  created: string
  client: IOrderClient
  is_permanent: boolean
}

export type TOrderKind = 'ad' | 'bg'
