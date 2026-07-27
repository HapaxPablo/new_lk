export interface ICounterparty {
  id: string
  name: string
  code1c?: string
  created?: string
  is_deleted?: boolean
}

export interface ICounterpartyDetails {
  id: string
  is_active: boolean
  created: string
  code1c: string
  opf: string
  inn: string
  first_name: string
  middle_name: string
  last_name: string
  description: string
  keyword: string
  additional_name: string
  broadcast: boolean
  owner: string
  address: string
  contact_persons: string[]
  brands: string[]
}

export interface ICounterpartyResponse {
  results: ICounterparty[]
  count: number
  next: string | null
  previous: string | null
}
