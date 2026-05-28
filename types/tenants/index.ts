export interface IGroupedTenant {
  tenantId: string
  tenantCode1c: string
  brandId: string
  brandName: string
  count: number
  brandLogotype: string
}

export interface IGroupedTenantsResponse {
  count: number
  next: string | null
  previous: string | null
  results: IGroupedTenant[]
}

export interface ITenantPlace {
  nomenclatureId: string
}

export interface ITenantBrand {
  id: string
  name: string
  logotype: string
}

export interface ITenantDetailResponse {
  tenantId: string
  tenantCode1c: string
  tenantName: string
  brand: ITenantBrand
  opf: string
  inn: string
  keyword: string
  totalPlaces: number
  places: ITenantPlace[]
}
