// Тип для элемента списка акций
export interface IPromotionList {
  /** Уникальный идентификатор */
  id: string
  /** Уникальный идентификатор (название) */
  title: string
  /** Название */
  name: string
  /** Актуальность */
  is_active: boolean
  /** Дата создания */
  created: string
  /** Начало периода */
  start_period: string | null
  /** Окончание периода */
  end_period: string | null
  /** Описание */
  description: string | null
  /** Код 1С */
  code1c: string | null
  /** Создатель */
  owner: string | null
  /** Контрагент */
  counterparty: string | null
}

// Тип для ответа с списком акций (пагинация)
export interface IPromotionResponse {
  count: number
  next: string | null
  previous: string | null
  results: IPromotionList[]
}

// Тип для детальной информации об акции
export interface IPromotionDetails {
  /** Уникальный идентификатор */
  id: string
  /** Логотип */
  logotype: string | null
  /** Код 1С */
  code1c: string
  /** Дата создания */
  created: string
  /** Основная информация */
  main_info: string
  /** Временная шкала */
  timeline: string
  /** Контрагент */
  counterparty: string
}

// Тип для параметров запроса списка акций
export interface IPromotionQueryParams {
  limit?: number
  page?: number
  search?: string
}
