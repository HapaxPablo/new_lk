import { IBrand } from '../nomenclature'

export interface ICreateBrandRequest {
  name: string
  logotype: string
  description: string
}

export interface IBrandListItem {
  id: string
  name: string
  logotype: string
  slug: string
}

export interface IBrandListResponse {
  results: IBrandListItem[]
  count: number
  next: string | null
  previous: string | null
}

export interface IBrandDetail {
  id: string
  logotype: string
  slug: string
  code1c: string
  name: string
  description: string
  created: string
  is_deleted: string
  deleted_at: string
}

interface IBrandNomenclatureExterior {
  source: string
  id: string
}

export interface IBrandNomenclatureShort {
  id: string
  nameForFront: string
  formattedAddress: string
  exterior: IBrandNomenclatureExterior[]
  typeOfPlace: string
  pricePerMonth: string
  brand?: IBrand
}
export interface IBrandNomenclatureListResponse {
  count: number
  next: string | null
  previous: string | null
  results: IBrandNomenclatureShort[]
}
