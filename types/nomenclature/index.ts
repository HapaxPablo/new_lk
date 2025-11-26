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
  code1c: string
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
  brand_id?: string
}

// Базовые интерфейсы для вложенных структур

// Интерфейс для настроек дня недели
export interface IDaySettings {
  worktime: string;
  default_volume: number[];
  custom_volume: Record<string, any>; //TODO позже  уточнить тип если известна структура
}

// Интерфейс для сетевых интерфейсов
interface INetworkInterface {
  ip: string;
  mac: string;
  iface: string;
}

// Интерфейс для аудиоустройств
interface IAudioDevice {
  card: number;
  name: string;
}

// Интерфейс для данных SD карты
interface ISDCardData {
  name: string;
  manf_id: string;
}

// Интерфейс для информации о железе
interface IHardwareInfo {
  model: string;
  revision: string;
  interfaces: INetworkInterface[];
  audiodevices: IAudioDevice[];
  sd_card_data: ISDCardData;
  serial_number: string;
}

// Интерфейс для изображений
interface IImage {
  source: string;
}

// Интерфейс для основной информации
interface IMainInfo {
  name: string;
  description: string;
  owner: {
    full_name: string;
  };
  timezone: string;
  status: number;
  last_answer: string;
  version: string;
  created: string;
}

// Интерфейс для настроек всех дней недели
interface IWeekSettings {
  mon: IDaySettings;
  tue: IDaySettings;
  wed: IDaySettings;
  thu: IDaySettings;
  fri: IDaySettings;
  sat: IDaySettings;
  sun: IDaySettings;
}

// Основной интерфейс для детальной информации о номенклатуре
export interface INomenclatureDetailsItem {
  id: string;
  article: number;
  settings: IWeekSettings;
  hw_info: IHardwareInfo;
  brand: IBrand;
  interior: IImage[];
  exterior: IImage[];
  address: string | null;
  legalEntity: string;
  contentType: string;
  typeOfPlace: string;
  pricePerMonth: string;
  code1c: string;
  main_info: IMainInfo;
}


// Интерфейс для дней недели (можно использовать для перечисления)
export enum EWeekDays {
  MON = 'mon',
  TUE = 'tue',
  WED = 'wed',
  THU = 'thu',
  FRI = 'fri',
  SAT = 'sat',
  SUN = 'sun'
}

// Интерфейс для упрощенного представления номенклатуры 
export interface ISimplifiedNomenclatureDetails {
  id: string;
  article: number;
  name: string;
  brandName: string;
  pricePerMonth: string;
  contentType: string;
  status: number;
  lastAnswer: string;
}

// Вспомогательные типы

// Тип для работы с настройками по дням
export type TDaySettings = {
  [key in EWeekDays]: IDaySettings;
};

// Тип для работы с временными интервалами
export type TTimeInterval = {
  start: string;
  end: string;
};

