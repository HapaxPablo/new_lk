export interface INomenclatureItem {
  code: string
  name: string
  brand: string
  isExample: boolean
  isOwn: string
  phoneNumber: string
  ownerPlaces: string
  article: string
  address: string // добавлено поле адреса
  logotype: string // путь к логотипу
  outside?: string // путь к фото фасада
  //TODO Паша сделай типы как надо
}

export interface INomenclatureResponse {
  nomenclatureList: INomenclatureItem[]
  total?: number
  limit?: number
  offset?: number
}

export interface INomenclatureQueryParams {
  limit?: number
  offset?: number
  searchValue?: string
}
