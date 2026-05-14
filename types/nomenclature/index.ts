import { TStatusType } from './status'

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

  slug?: string
}

export interface ITypeOfPlace {
  id: string
  name: string
  tariff: string
  tariff_single: string
  abbreviation: string
  code1c: string
  is_mall: boolean
  is_active: boolean
}

export interface ITypeOfPlaceResponse {
  results: ITypeOfPlace[]
}

export interface ILegalEntity {
  id: string
  name: string
}
export interface IBrandResponse {
  results: IBrand[]
}

// Тип для контента
export type ContentType = 'Аудио' | 'Видео' | 'Аудио+Видео'

// Интерфейс адреса номенклатуры
export interface IAddressNomenclature {
  id: string
  country: {
    id: string
    name: string
  }
  federalDistrict: {
    id: string
    name: string
    abbreviated_name: string
    country: string
  }
  region: {
    id: string
    name: string
    abbreviated_name: string
    federal_district: string
    type_region: string
    timezone: string
  }
  city: {
    id: string
    name: string
    region: string
    locality_type: string
    timezone: string
  }
  administrative_territory: {
    id: string
    name: string
    city: string
  }
  administrative_unit: {
    id: string
    name: string
    city: string
    administrative_territory: string
  }
  street: {
    id: string
    name: string
    city: string
    street_type: string
  }
  house: {
    id: string
    number: string
    street: string
  }
  building: {
    id: string
    number: string
    house: string
  }
  microdistrict: string
  index: string // почтовый индекс
  coordinates: {
    id: string
    latitude: string
    longitude: string
  }
  full_address: string
}

// Интерфейс элемента номенклатуры
// export interface INomenclatureItem {
//   id: string
//   nameForFront: string
//   code1c: string
//   article: string
//   name: string
//   timezone: string
//   status: string
//   last_answer: string
//   version: string
//   brand: IBrand
//   exterior: { source: string }[]
//   // address: IAddressNomenclature
//   formattedAddress: string | IFormattedAddress
//   legalEntity: ILegalEntity
//   contentType: ContentType
//   typeOfPlace: string
//   pricePerMonth: string
// }

// Интерфейс ответа для номенклатуры
export interface INomenclatureResponse {
  results: INomenclatureItem[]
  count: number
  next: string | null
  previous: string | null
}

// Интерфейс параметров запроса для номенклатуры
export interface INomenclatureQueryParams {
  limit?: number
  page?: number
  search?: string
  brand_name?: string
  brand_id?: string
}

// Базовые интерфейсы для вложенных структур

// Интерфейс для настроек дня недели
export interface IDaySettings {
  worktime: string
  default_volume: number[]
  custom_volume: Record<string, any> //TODO позже  уточнить тип если известна структура
}

// Интерфейс для сетевых интерфейсов
interface INetworkInterface {
  ip: string
  mac: string
  iface: string
}

// Интерфейс для аудиоустройств
interface IAudioDevice {
  card: number
  name: string
}

// Интерфейс для данных SD карты
interface ISDCardData {
  name: string
  manf_id: string
}

// Интерфейс для информации о железе
interface IHardwareInfo {
  model: string
  revision: string
  interfaces: INetworkInterface[]
  audiodevices: IAudioDevice[]
  sd_card_data: ISDCardData
  serial_number: string
}

// Интерфейс для изображений
export interface IImage {
  source: string
}

// Интерфейс для основной информации
interface IMainInfo {
  name: string
  description: string
  owner: {
    full_name: string
  }
  timezone: string
  status: TStatusType
  last_answer: string
  version: string
  created: string
}

// Интерфейс для настроек всех дней недели
interface IWeekSettings {
  mon: IDaySettings
  tue: IDaySettings
  wed: IDaySettings
  thu: IDaySettings
  fri: IDaySettings
  sat: IDaySettings
  sun: IDaySettings
}

export interface IResponsiblePerson {
  id: string
  full_name: string
  phone_number: string[]
}
export type ResponsiblePersonRole =
  | 'ad'
  | 'radio'
  | 'technic'
  | 'technic_on_address'
  | 'placement_marketing'

export type TResponsiblePersons = {
  [role in ResponsiblePersonRole]?: IResponsiblePerson
}
export interface ITenantsListItem {
  id: string
  brands_list: string //TODO: удалить после настройки имени на бэке
  logotype: string
  floor: string
}

export interface ITenantsResponse {
  count: number
  next: string | null
  previous: string | null
  results: ITenantsListItem[]
}

interface IFormattedAddress {
  name: string
  coordinates: {
    latitude: string
    longitude: string
  }
}

export interface INomenclatureBase {
  id: string
  nameForFront: string
  code1c: string
  brand: IBrand
  exterior: { source: string }[]
  formattedAddress: string | IFormattedAddress // union в базе
  legalEntity: ILegalEntity
  contentType: string
  typeOfPlace: string
  pricePerMonth: string
}

export interface INomenclatureItem extends INomenclatureBase {
  article: string
  name: string
  timezone: string
  status: string
  last_answer: string
  version: string
  formattedAddress: string // сужаем — в каталоге всегда строка
}

export interface INomenclatureDetailsItem extends INomenclatureBase {
  article: number
  formattedAddress: IFormattedAddress // сужаем — в деталях всегда объект
  interior: IImage[]
  exterior: IImage[]
  settings: IWeekSettings
  hw_info: IHardwareInfo
  main_info: IMainInfo
  responsible: TResponsiblePersons
  tenants: ITenantsListItem[]
  external_video_media: string
  external_audio_media: string
  internal_video_media: string
  internal_audio_media: string
  worktime_start: string
  worktime_end: string
  square: string
  possibility: string
  created_at?: string
  updated_at?: string
}

// Основной интерфейс для детальной информации о номенклатуре
// export interface INomenclatureDetailsItem {
//   id: string
//   nameForFront: string
//   article: number
//   settings: IWeekSettings
//   hw_info: IHardwareInfo
//   brand: IBrand
//   interior: IImage[]
//   exterior: IImage[]
//   formattedAddress: IFormattedAddress
//   legalEntity: ILegalEntity
//   contentType: string
//   typeOfPlace: string
//   pricePerMonth: string
//   code1c: string
//   main_info: IMainInfo
//   responsible: TResponsiblePersons
//   tenants: ITenantsListItem[]
//   external_video_media: string
//   external_audio_media: string
//   internal_video_media: string
//   internal_audio_media: string
//   worktime_start: string
//   worktime_end: string
//   square: string
//   possibility: string
// }

// Интерфейс для дней недели (можно использовать для перечисления)
export enum EWeekDays {
  MON = 'mon',
  TUE = 'tue',
  WED = 'wed',
  THU = 'thu',
  FRI = 'fri',
  SAT = 'sat',
  SUN = 'sun',
}

// Интерфейс для упрощенного представления номенклатуры
export interface ISimplifiedNomenclatureDetails {
  id: string
  article: number
  name: string
  brandName: string
  pricePerMonth: string
  contentType: string
  status: number
  lastAnswer: string
}

// Вспомогательные типы

// Тип для работы с настройками по дням
export type TDaySettings = {
  [key in EWeekDays]: IDaySettings
}

// Тип для работы с временными интервалами
export type TTimeInterval = {
  start: string
  end: string
}
type status = {
  0: 'недоступен'
  1: 'доступен 5 минут'
  2: 'недоступен более 1 часа'
}
