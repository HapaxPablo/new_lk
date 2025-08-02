type ContentType = 'Аудио' | 'Видео' | 'Аудио+Видео'

//TODO доработать интерфейс номенклатуры согласно тз и схеме с апи
export interface INomenclatureItem {
  brand?: string
  address?: {
    federalDistrict: string
    city: string
    district: string
    street: string
    streetHouse: string
  }
  logotypeURL?: string
  outSidePhotoURL?: string //мб в будущем будет массив уролов
  legalEntity?: string
  article: string
  id: string
  contentType?: string //тип контента аудио, видео или аудио+видео
  typeOfPlace?: string //тип места "Строительные, отделочные материалы, мебель", Торговый центр, Аптека и тд
}

export interface INomenclatureResponse {
  results: INomenclatureItem[]
  count: number
  next: number
  previous: number
}

export interface INomenclatureQueryParams {
  limit?: number
  page?: number
  searchValue?: string
}
