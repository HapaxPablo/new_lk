export interface INomenclatureItem {
  code: string
  name: string
  isExample: boolean
  isOwn: string
  phoneNumber: string
  ownerPlaces: string
  articule: string
  address: string // добавлено поле адреса
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
  search?: string
}
