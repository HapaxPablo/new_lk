export interface IBrand {
  /** ИД бренда */
  id: string
  /** Наименование бренда */
  name: string
  /** Логотип бренда url */
  logotype: string
  /** Дата создания */
  created: string
  /** Описание бренда */
  description?: string | null
  /** Код из 1С */
  code1c?: string | null
}

export interface IBrandResponse {
  results: IBrand[]
}

// Тип для контента
export type ContentType = 'Аудио' | 'Видео' | 'Аудио+Видео'

// Интерфейс адреса номенклатуры
export interface IAddressNomenclature {
  index: string
  country: string
  city: string
  locality: string
  region: string
  administrativeTerritory: string
  microdistrict: string
  federalDistrict: string
  street: string
  street_house: string
  building: string
  coordinates: string
}

// Интерфейс элемента номенклатуры
export interface INomenclatureItem {
  id: string
  article: string
  name: string
  timezone: string
  status: string
  last_answer: string
  version: string
  brand: IBrand
  exterior: { source: string }[]
  address: IAddressNomenclature
  legalEntity: string
  contentType: ContentType
  typeOfPlace: string
  pricePerMonth: string
}

// Интерфейс ответа для номенклатуры
export interface INomenclatureResponse {
  results: INomenclatureItem[]
  count: number
  next: number
  previous: number
}

// Интерфейс параметров запроса для номенклатуры
export interface INomenclatureQueryParams {
  limit?: number
  page?: number
  name?: string
  brand_name?: string
}
