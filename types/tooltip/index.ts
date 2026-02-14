// Типы для конфигурации подсказок

export type TooltipPage =
  | 'nomenclature'
  | 'counterparty'
  | 'promotion'
  | 'brand'

export type TooltipElementType =
  | 'brand'
  | 'legalEntity'
  | 'counterparty'
  | 'owner'
  | 'responsible'
  | 'address'

// Конфигурация API эндпоинтов для разных типов элементов
export interface TooltipConfig {
  page: TooltipPage
  elementType: TooltipElementType
  apiEndpoint: (id: string) => string
  modalTitle: string
}

// Маппинг конфигураций для подсказок
export const TOOLTIP_CONFIGS: Record<string, TooltipConfig> = {
  // Подсказка для бренда на странице номенклатуры
  'nomenclature-brand': {
    page: 'nomenclature',
    elementType: 'brand',
    apiEndpoint: (id: string) => `/api/brands/${id}`,
    modalTitle: 'Информация о бренде',
  },
  // Подсказка для контрагента на странице номенклатуры
  'nomenclature-counterparty': {
    page: 'nomenclature',
    elementType: 'counterparty',
    apiEndpoint: (id: string) => `/api/counterparties/${id}`,
    modalTitle: 'Информация о контрагенте',
  },
  // Подсказка для бренда на странице акций
  'promotion-brand': {
    page: 'promotion',
    elementType: 'brand',
    apiEndpoint: (id: string) => `/api/brands/${id}`,
    modalTitle: 'Информация о бренде',
  },
  // Подсказка для контрагента на странице акций
  'promotion-counterparty': {
    page: 'promotion',
    elementType: 'counterparty',
    apiEndpoint: (id: string) => `/api/counterparties/${id}`,
    modalTitle: 'Информация о контрагенте',
  },
  // Подсказка для контрагента на странице контрагентов
  'counterparty-counterparty': {
    page: 'counterparty',
    elementType: 'counterparty',
    apiEndpoint: (id: string) => `/api/counterparties/${id}`,
    modalTitle: 'Информация о контрагенте',
  },
}

// Функция для получения ключа конфигурации
export function getTooltipKey(
  page: TooltipPage,
  elementType: TooltipElementType
): string {
  return `${page}-${elementType}`
}

// Функция для получения конфигурации подсказки
export function getTooltipConfig(
  page: TooltipPage,
  elementType: TooltipElementType
): TooltipConfig | undefined {
  const key = getTooltipKey(page, elementType)
  return TOOLTIP_CONFIGS[key]
}
