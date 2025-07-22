type ContentType = 'Аудио' | 'Видео' | 'Аудио+Видео'

export interface INomenclatureItem {
  brand?: string
  adress?: {
    federalDistrict: string
    city: string
    district: string
    street: string
    streetHouse: string
  }
  logotypeURL?: string
  outSidePhotoURL?: string //мб в будущем будет массив уролов
  legalEntity?: string
  article?: string
  id: string
  contentType?: string //тип контента аудио, видео или аудио+видео
  typeOfPlace?: string //тип места "Строительные, отделочные материалы, мебель", Торговый центр, Аптека и тд
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
